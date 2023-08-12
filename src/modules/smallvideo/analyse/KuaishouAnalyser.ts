import { BaseAnalyser } from './Analyser';

import { getHtmlWith302, postHtml, simpleHttpsRequest } from '../util/httpUtil';
import { sign4ks } from '../util/sig3';

const parse = require('url-parse');

export class KuaishouAnalyser extends BaseAnalyser {
  config = {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
      Cookie:
        '',
    },
    userCenter: {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
        Cookie:
          'did=web_fff7cc3aef8649e59880c8b11cd5bf3f; didv=1651897510000; sid=439ca006f56ff6139172ae84; Hm_lvt_86a27b7db2c5c0ae37fee4a8a35033ee=1651830692; OUTFOX_SEARCH_USER_ID_NCOO=1800814239.0575387; clientid=3; client_key=65890b29; Hm_lpvt_86a27b7db2c5c0ae37fee4a8a35033ee=1651903471',
      },
    },
    productListUrl: 'https://c.kuaishou.com/rest/kd/feed/profile',
    jsonDataReg: /window.__APOLLO_STATE__=(.*?)<\/script>/g,
    descReg: /"caption":"(.*?)",/g,
    coverReg: /"poster":"(.*?)",/g,
    videoReg: /"srcNoMark":"(.*?)",/g,
    picsReg: /"images":\[(.*?)\],/g,
    imgCDNReg: /"imageCDN":"(.*?)"/g,
  };

  async parseVideoInfoByUrl(url: string, cookie2?: string) {
    let { cookie, body, options } = await this.getHtmlByCircle(url, cookie2, {}, 'kpf=PC_WEB; clientid=3; kpn=KUAISHOU_VISION');
    console.log('cookie:',cookie);
    console.log('options:', options);

    const ret = await simpleHttpsRequest(options);
    body = ret.body
    console.log('body:::::::', body)

    if (
      options.url.indexOf('https://v.m.chenzhongtech.com/fw/next-photo/') !== -1
    ) {
      // 临时方案 快手链接失效
      const oldUrl = options.url.replace(
        'https://v.m.chenzhongtech.com/fw/next-photo/',
        'https://c.kuaishou.com/fw/photo/',
      );
      const ret = await this.getHtmlByCircle(oldUrl, cookie2, {}, 'kpf=PC_WEB; clientid=3; kpn=KUAISHOU_VISION');
      cookie = ret.cookie;
      body = ret.body;
      options = ret.options;
    }

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
      
      console.log('content:', jsonData)
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
