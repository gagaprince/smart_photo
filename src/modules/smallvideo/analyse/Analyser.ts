import cheerio from 'cheerio';
import { getHtmlWith302OneStep } from '../util/httpUtil';
const parse = require('url-parse');
export interface IVideoData {
  videoUrl?: string;
  cover?: string;
  desc?: string;
  mp3Url?: string;
  pics?: string[];
  user?: string;
  type?: string;
  refer?: string;
  cookie?: string;
  query?: string;
}

export interface IStreamData {
  flvmap?: object,
  hlsmap?: object,
  flv?: string;
  type?: string;
  owner?: object;
  roomTitle?: string;
  roomId?: string;
  webRoomId? : string;
}

export interface IProduct {
  desc?: string;
  cover?: string;
  productId: string;
  author?: any;
  videoUrl?: string;
  contentLink?: string;
}
export interface IProductData {
  productList: IProduct[];
  max: string;
  hasMore: boolean;
  refer?: string;
  cookie?: string;
}

export interface Analyser {
  parseStreamWithLink: (url: string) => Promise<IStreamData>
  parseVideoInfoByUrl: (url: string, cookie?: string) => Promise<IVideoData>;
  parsePhotoInfo: (id: string) => Promise<IVideoData>;
  getProductList: (
    user: string,
    size: number,
    max: string,
    refer?: string,
    cookie?: string,
  ) => Promise<IProductData>;
}

export abstract class BaseAnalyser implements Analyser {
  abstract config: any;
  cheerio: any;
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
  _compareHost(host1, host2) {
    const host1s = host1.split('.');
    const host2s = host2.split('.');
    return host1s[host1s.length - 2] === host2s[host2s.length - 2];
  }

  getCookieByHost(cookieMap={}, host, commonCookie='') {
    const hosts = host.split('.');
    const cookieKey = hosts[hosts.length - 2];
    const cookieRet = Object.keys(cookieMap).reduce((pre, hostInMap) => {
      const hosts = host.split('.');
      const hostKey = hosts[hosts.length - 2];
      if (hostKey === cookieKey) {
        pre = `${pre} ${cookieMap[hostInMap]}`
      }
      return pre.trim();
    }, '');
    return `${cookieRet} ${commonCookie}`.trim();
  }

  async getHtmlByCircle(url, cookie2?: string, cookieMap={}, commonCookie='') {
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

    // console.log('cookie2:', cookie2)

    const {
      statusCode,
      cookie = '',
      location,
      body,
      options,
    } = await getHtmlWith302OneStep(url, !!cookie2, params);
    if (statusCode == 302 || statusCode == 307) {
      // console.log(statusCode, ':', body, cookie, location)
      const newHost = parse(location).host;
      cookieMap[host] =`${cookieMap[host]||''} ${cookie}` ;
      const newCookie = this.getCookieByHost(cookieMap, newHost, commonCookie);
      // console.log('newCookie:', newCookie);
      return await this.getHtmlByCircle(location, newCookie, cookieMap, commonCookie);
    }
    return { body, options, cookie };
  }
  constructor() {
    this.cheerio = cheerio;
  }
  abstract parseStreamWithLink(url: string);
  abstract parseVideoInfoByUrl(url: string, cookie?: string);
  abstract parsePhotoInfo(id: string);
  abstract getProductList(
    user: string,
    size: number,
    max: string,
    refer?: string,
    cookie?: string,
  );
}
