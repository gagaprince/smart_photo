import { BaseAnalyser } from './Analyser';
import { crc32 } from '../util/crcUtil';
import { getHtml } from '../util/httpUtil';

export class XiGuaAnalyser extends BaseAnalyser {
  async parseStreamWithLink(url: string) {
    return {};
  }
  config = {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Linux; Android 8.0; Pixel 2 Build/OPD3.170816.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.54 Mobile Safari/537.36',
    }, //window._SSR_DATA
    jsonDataReg: /window._SSR_DATA = (.*?)<\/script>/g,
    videoInterface: 'https://ib.365yg.com/video/urls/v/1/toutiao/mp4/',
    videoInterfacePath: '/video/urls/v/1/toutiao/mp4/',
  };
  async parseVideoInfoByUrl(url: string) {
    const { cookie, body, options } = await this.getHtmlByCircle(url);
    // console.log(body);
    const jsonData =
      this.getTextByReg(this.config.jsonDataReg, body, true) || '{}';
    // console.log(jsonData);
    const json = JSON.parse(jsonData);
    // console.log(json);
    // console.log(
    //   json?.data?.loadersData?.getVideoInfo?._result?.cover_image_url,
    // );

    const videoId =
      json?.data?.loadersData?.getVideoInfo?._result?.video_id || '';
    console.log('videoId:', videoId);
    const cover =
      json?.data?.loadersData?.getVideoInfo?._result?.cover_image_url || '';
    const desc = json?.data?.loadersData?.getVideoInfo?._result?.title || '';
    const user =
      json?.data?.loadersData?.getVideoInfo?._result?.media_user?.id || '';
    let videoUrl = '';
    try {
      videoUrl = await this.getVideoById(videoId);
    } catch (e) {
      console.log(e);
    }
    return {
      videoUrl,
      cover,
      desc,
      user,
      type: 'xigua',
    };
  }

  async getVideoById(id: string) {
    const r = Date.now();
    const interUrlPath = `${this.config.videoInterfacePath}${id}?r=${r}`;
    const s = crc32(interUrlPath) >>> 0;
    let interUrl = `${this.config.videoInterface}${id}?r=${r}&s=${s}&nobase64=true&aid=3586&logo_type=unwatermarked&vfrom=xgplayer`;
    console.log(interUrl);
    const ret = await getHtml(interUrl);
    let videoUrl = '';
    if (ret) {
      const retJson = JSON.parse(ret);
      const videoObj = retJson?.data?.video_list || {};
      const videoList: any = Object.values(videoObj);
      videoUrl = decodeURI(videoList.pop()?.main_url || '');
    }
    return videoUrl;
  }

  async parsePhotoInfo(id: string) {
    return null;
  }

  async getProductList(
    user: string,
    size: number,
    max: string,
    refer?: string,
    cookie?: string,
  ) {
    return { hasMore: true, max: '0', productList: [] };
  }
}
