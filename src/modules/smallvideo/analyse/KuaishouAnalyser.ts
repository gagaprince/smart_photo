import { BaseAnalyser } from './Analyser';

import {
  getHtmlWith302,
  postHtml,
  getHtmlWith302OneStep,
} from '../util/httpUtil';
import { sign4ks } from '../util/sig3';

const parse = require('url-parse');

export class KuaishouAnalyser extends BaseAnalyser {
  config = {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Mobile Safari/537.36',
      Cookie:
        'did=web_fff7cc3aef8649e59880c8b11cd5bf3f; didv=1651897510000; sid=439ca006f56ff6139172ae84; Hm_lvt_86a27b7db2c5c0ae37fee4a8a35033ee=1651830692; OUTFOX_SEARCH_USER_ID_NCOO=1800814239.0575387; clientid=3; client_key=65890b29; Hm_lpvt_86a27b7db2c5c0ae37fee4a8a35033ee=1651903471',
    },
    userCenter: {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Mobile Safari/537.36',
        Cookie:
          'did=web_fff7cc3aef8649e59880c8b11cd5bf3f; didv=1651897510000; sid=439ca006f56ff6139172ae84; Hm_lvt_86a27b7db2c5c0ae37fee4a8a35033ee=1651830692; OUTFOX_SEARCH_USER_ID_NCOO=1800814239.0575387; clientid=3; client_key=65890b29; Hm_lpvt_86a27b7db2c5c0ae37fee4a8a35033ee=1651903471',
      },
    },
    productListUrl: 'https://c.kuaishou.com/rest/kd/feed/profile',
    jsonDataReg: /window.pageData=(.*?)<\/script>/g,
    descReg: /"caption":"(.*?)",/g,
    coverReg: /"poster":"(.*?)",/g,
    videoReg: /"srcNoMark":"(.*?)",/g,
    picsReg: /"images":\[(.*?)\],/g,
    imgCDNReg: /"imageCDN":"(.*?)"/g,
  };

  _compareHost(host1, host2) {
    const host1s = host1.split('.');
    const host2s = host2.split('.');
    return host1s[host1s.length - 2] === host2s[host2s.length - 2];
  }

  async getHtmlByCircle(url, cookie2?: string) {
    const { host } = parse(url);
    const params = {
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
      Host: host,
      'user-agent': this.config.headers['User-Agent'],
      Referer: url,
    };
    if (cookie2) {
      params['Cookie'] = cookie2;
    }

    const {
      statusCode,
      cookie,
      location,
      body,
      options,
    } = await getHtmlWith302OneStep(url, !!cookie2, params);
    if (statusCode == 302) {
      const newHost = parse(location).host;
      if (this._compareHost(newHost, host)) {
        return await this.getHtmlByCircle(location, cookie);
      }
      return await this.getHtmlByCircle(location);
    }
    return { body, options, cookie };
  }

  async parseVideoInfoByUrl(url: string, cookie2?: string) {
    const { cookie, body, options } = await this.getHtmlByCircle(url, cookie2);

    if (options.url.indexOf('https://c.kuaishou.com/fw/user/') !== -1) {
      const { pathname, query } = parse(options.url);
      const user = pathname.replace('/fw/user/', '');
      return {
        user,
        type: 'kuaishou',
        refer: options.url,
        cookie: options.headers?.Cookie || '',
        query,
      };
    }

    try {
      const jsonData =
        this.getTextByReg(this.config.jsonDataReg, body, true) || '{}';

      const json = JSON.parse(jsonData);
      const videoUrl = json['video']['srcNoMark'];
      const cover = json['video']['poster'];
      const desc = json['video']['caption'];
      const domain = json['video']['imageCDN'];
      const pics = (json['video']['images'] || []).map(item => {
        return `https://${domain}${item.path}`;
      });
      const user = json['user']['kwaiId'] || json['user']['eId'];
      return {
        videoUrl,
        cover,
        desc,
        mp3Url: '',
        pics,
        type: 'kuaishou',
        user,
      };
    } catch (e) {}
    return {};
  }

  getTextByReg(reg, text, flag = false) {
    const r = new RegExp(reg);
    const attr = r.exec(text);
    const ret = attr && attr[1];
    if (ret) {
      if (flag) {
        return ret;
      }
      return decodeURIComponent(JSON.parse(`"${ret}"`));
    }
    return '';
  }

  async parseUserCenterInfo(url: string) {
    const { html, options } = await getHtmlWith302(url, {
      'user-agent': this.config['userCenter'].headers['User-Agent'],
      Cookie: this.config.headers['Cookie'],
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
      Referer: url,
    });
    // console.log(html);
    // console.log(options);
    const path = options.url.split('?')[0];
    const args = path.split('/');
    const user = args[args.length - 1];
    return { user, type: 'kuaishou', refer: options.url };
  }

  async parsePhotoInfo(id: string) {
    return null;
  }

  async getProductList(
    user: string,
    size = 9,
    max = '0',
    refer = '',
    cookie = 'user,',
  ) {
    const sig3 = await sign4ks();
    const url = `${this.config.productListUrl}?__NS_sig3=${sig3}`;
    const text = await postHtml(
      url,
      {
        Cookie: cookie || this.config.headers['Cookie'],
        Accept: 'application/json',
        'user-agent': this.config['userCenter'].headers['User-Agent'],
        Referer: refer,
        kpf: 'H5',
        kpn: 'KUAISHOU',
        host: 'c.kuaishou.com',
        Origin: 'https://c.kuaishou.com',
      },
      {
        eid: user,
        count: size,
        pcursor: max,
      },
    );
    const json = JSON.parse(text);
    if (json.result === 1) {
      const { feeds, pcursor } = json;
      const productList = feeds.map(item => {
        const shareInfo = item['share_info'];
        const args = shareInfo.split('=');
        const productId = args[args.length - 1];
        return {
          desc: item['caption'],
          cover: item['coverUrls'][0]['url'],
          productId,
          contentLink: `https://c.kuaishou.com/fw/photo/${productId}`,
          author: {
            userName: item['userName'],
            userEid: item['userEid'],
          },
          videoUrl: '',
        };
      });
      const ret = {
        hasMore: feeds.length > 0,
        max: pcursor,
        productList,
        refer,
        cookie,
      };
      return ret;
    }
    return { hasMore: true, max: '0', productList: [] };
  }
}