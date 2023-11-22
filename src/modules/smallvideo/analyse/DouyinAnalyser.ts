import { BaseAnalyser } from './Analyser';
import { getHtmlWith302 } from '../util/httpUtil';
import { generateSignature } from '../util/sign';
import { title } from 'process';
export class DouyinAnalyser extends BaseAnalyser {
  config = {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.88 Safari/537.36',
      // 'Cookie': 'douyin.com; ttwid=1%7CZC51m3uiHpYVPLqj8vPeufcz_PiejZKR7jMTF_XyzrQ%7C1650876644%7C84870b9c10d2a167cd6302674e062fc402b134abc4e5200f1909519c6d129b0a; _tea_utm_cache_6383=undefined; passport_csrf_token=c045d950791b3382a570b57738ab00f2; passport_csrf_token_default=c045d950791b3382a570b57738ab00f2; _tea_utm_cache_1300=undefined; AVATAR_LOGIN_GUIDE_COUNT=1; s_v_web_id=verify_l2ehbzod_PsgmsGvc_TvFs_4Z66_97s1_ZHzu0G2zkRGn; _tea_utm_cache_2285=undefined; ttcid=0866bc9d76734c74a3b3dea0b3be831742; THEME_STAY_TIME=299509; IS_HIDE_THEME_CHANGE=1; pwa_guide_count=3; __ac_nonce=062676518008cbcde146e; __ac_signature=_02B4Z6wo00f01UaGSMgAAIDC0lATxdI13q1GpkxAADPK7J22PnprD.6lUhsV.QQxv4r0e6pD2LCw1kHwAL9OwqJCIgqUogBK9Dl1IT1HHai6UgfV2blxfj8aq6VGJFoOt-wlOZ.U3o.EO4XC29; strategyABtestKey=1650943258.382; AB_LOGIN_GUIDE_TIMESTAMP=1650943258235; msToken=GtvIj3spx_xiK4LxAo-suvAZxWQRaVOgQWbh004Cd6PvVThL_DDmZ5gyYJ1-tBioypi9zf5AWTOFKe2iBKKLpi8FWieDm-SrAHNoUoX7Ah-lTA_zodoh78r0Mp6lMswM; tt_scid=Mpt0f6bgv4ptwI5BGWTNNpe8dH3pNwVwK0bz62wtpYBsxvjQTG7XYfjge5Tkpq4g88b5; home_can_add_dy_2_desktop=1; msToken=IHpkvmWpLZ7FomcURbps_VBwvYLiT_pNXdruyGssNeRuaSTIc_vpsCPYqqc24L-tIqa-qRYxMHqX84YgmiczAHJGzn1heOHnPJQNX-2vJPGaWxXzH8c0UDQebRAH3mxo',
      Cookie:
        'douyin.com; device_web_cpu_core=12; device_web_memory_size=8; architecture=amd64; _wafchallengeid=eyJ2Ijp7ImEiOiJxb1h0dWFXbkt4SGxlcnlnVGEyL1dEM2pGNndJWEFSWE15Q2JpakdhenVNPSIsImIiOjE2OTk0NTE3MjksImMiOiIvZG9oKzZyVnNuSGJ1Y2dKUGwyeDR2UWVXVktwY1RlcWRWRlMxUjZDNjBRPSJ9LCJzIjoiVVgwbkkyTWRvWlZTV2dGbVp0OFVHTzhqcklhT21KdmhyQ1doa3gzclRLdz0iLCJkIjoiTVE9PSJ9; __ac_nonce=0654b901b009aab36b805; __ac_signature=_02B4Z6wo00f01bkzKlAAAIDA2jnqOrUg4.W5Ey7AAAsIgFL6-83p-dJI8973sJQQ6W.ppDx9cf.CcSXCgjv9ikgGZKKEIe64Usmvl23dzE6cfU3JqH3zlBA-vzMyUYd4.96hXiF2RVPYNE3869; s_v_web_id=verify_lopt6yb5_16tz0nbt_0Fsg_41hK_Axkt_gVW4OWLCHoCk; csrf_session_id=36293f4073ff61b0352e6fca70e20944; bd_ticket_guard_client_data=eyJiZC10aWNrZXQtZ3VhcmQtdmVyc2lvbiI6MiwiYmQtdGlja2V0LWd1YXJkLWl0ZXJhdGlvbi12ZXJzaW9uIjoxLCJiZC10aWNrZXQtZ3VhcmQtcmVlLXB1YmxpYy1rZXkiOiJCSWFNWW9jTHdwaTNBU1RUUDYvUWk5T21FbjdIRWNPRyt6WldtSlpJVlJQb2pjMnJrcDgzZEI3dXkzNFVCRlBCM3Fqc3dmWjlaTTVDN1FIWlRWT3NCYk09IiwiYmQtdGlja2V0LWd1YXJkLXdlYi12ZXJzaW9uIjoxfQ%3D%3D; tt_scid=if1CKSgPqZIp7G0xBHuZAVdaPawcp0QglXLsqYetnZwEl3fnEx4IY8QtrC2RSOpO860a; msToken=IOrVxj8CTPjsT-A-ZKUIsB1RUaFjEgvJ89iiYwKuM3PYfrDmOq0CnBrZGlD31tARXfV5nUsr530zZruJeqQzgb7MxROeH7Pj7qM1urRy5Q3yUILxNVES4wfBG1ggtK8=; IsDouyinActive=false; webcast_local_quality=null',
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    },
    photoReqUrl: 'https://www.iesdouyin.com/web/api/v2/aweme/iteminfo/',
    productListUrl: 'https://www.iesdouyin.com/web/api/v2/aweme/post/',
  };

  getPageInfoFromHtml(html:string):any {
    // console.log('html:',html);
    // let regex = /self.__pace_f.push\((\[1,\"[a|9|b]:.*?)\)<\/sc/;
    const regex = /self.__pace_f.push\((\[1,\"[a-z|0-9]:.*?roomInfo\\":\{\\"room\\".*?)\)<\/sc/;
    const matchResult = html.match(regex);
    
    const parameter = matchResult[1];
    if(parameter) {
      try{
        const ret = JSON.parse(parameter);
        const info = ret[1] || '';
        if(info){
          const ret2 = JSON.parse(info.substring(2))
          return ret2[ret2.length-1];
        }
      }catch(e){
        console.error(e);
      }
    }
    return {};
  }

  async parseStreamWithLink(url:string){
    const headers = { 
      'User-Agent': this.config.headers['User-Agent'],
      'Accept': this.config.headers['Accept'],
      'Cookie': '',
     };
    headers['Referer'] = url;
    let contentHtml = '';
    const { html, options } = await getHtmlWith302(url, headers);
    const $ = this.cheerio.load(html);
    const hasTitle = $('title').length;
    if(!html || !hasTitle){
      const ret = await getHtmlWith302(url, options.headers);
      contentHtml = ret.html;
    }else{
      contentHtml = html;
      console.log('contentHtml:', contentHtml);
    }
    const type = 'douyin'

    try {
      const pageInfo = this.getPageInfoFromHtml(contentHtml)
      // console.log('pageInfo:::------------:::', pageInfo)
      
      const initialState = pageInfo['state'] || {};
      const roomStore = initialState['roomStore'] || {};
      const roomInfo = roomStore['roomInfo'] || {};
      // console.log('roomInfo:', roomInfo);
      const room = roomInfo['room'] || {};
      const roomId = roomInfo['roomId'] || '';
      const webRoomId = roomInfo['web_rid'] || '';
      const roomTitle = room['title'] || '';
      const stream_url = room['stream_url'] || {};
      const flv_pull_url = stream_url ['flv_pull_url'] || {};
      const hls_pull_url_map = stream_url['hls_pull_url_map'] || {};
      const FULL_HD1 = flv_pull_url['FULL_HD1'] || ''

      const owner = roomInfo['anchor'] || {}
       
      return {
        flvmap: flv_pull_url,
        hlsmap: hls_pull_url_map,
        flv:FULL_HD1,
        type,
        owner,
        roomTitle,
        roomId,
        webRoomId,
      };
    }catch(e){
      console.error(e);
    }

    return {}
    
  }

  async parseVideoInfoByUrl(url: string) {
    const headers = { ...this.config.headers };
    headers['Referer'] = url;

    // const html = await this.getHtml(url);
    const { html, options } = await getHtmlWith302(url, headers);
    let videoUrl, desc, cover, mp3Url, pics, user;
    const type = 'douyin';
    // console.log(html);
    // console.log(options.url);
    if (options.url.indexOf('www.iesdouyin.com') === -1) {
      if (/www.douyin.com\/user/g.test(options.url)) {
        const path = options.url.split('?')[0];
        const args = path.split('/');
        user = args[args.length - 1];
      } else {
        console.log('options:',options);
        const {url} = options;
        console.log(url);
        const lightVideoUrl = url.replace('video', 'light');
        console.log(lightVideoUrl);
        const ret = await getHtmlWith302(lightVideoUrl, options.headers);

        const htmlNew = ret.html;

        const $ = this.cheerio.load(htmlNew);
        // console.log('htmlNew:::------------:::', htmlNew);
        const dataContent = decodeURIComponent($('#RENDER_DATA').html() || '{}');
        // console.log('dataContent:', dataContent);
        const pageInfo = JSON.parse(dataContent);
        // console.log('pageInfo:::------------:::', pageInfo)
        const desObj = this._findDesObj(pageInfo);


        // console.log('desObj:', JSON.stringify(desObj))

        // 解析vedioUrl
        try {
          videoUrl = `https:${desObj['defaultData']['video']['playAddr'][0]['src']}`;
          desc = desObj['defaultData']['desc'];
          cover = desObj['defaultData']['video']['coverUrlList'][0];
          mp3Url = desObj['defaultData']['music']['playUrl']['urlList'][0];
          const awemeType = desObj['defaultData']['awemeType'] || 0;
          console.log(`awemeType:${awemeType}`);
          if (awemeType !== 0) {
            videoUrl = '.mp3';
          }
        } catch (e) {
          console.log(e);
          videoUrl = desc = cover = mp3Url = '';
        }
        if (videoUrl.indexOf('.mp3') !== -1) {
          console.log('竟然是图片');
          // 认为是图片
          try{
            const imgObjs = desObj['aweme']['detail']['images'] || [];
            pics = imgObjs.map(imgObj => imgObj.urlList[0]);
            // console.log(pics);
          }catch(e){
            console.log(e);
            videoUrl = desc = cover = mp3Url = '';
          }
          // const _url = options.url.split('?')[0];
          // const args = _url.split('/');
          // const id = args[args.length - 1];
          // return this.parsePhotoInfo(id);
        }
      }
    } else {
      // 图片的分支
      console.log('是图片');
      const _url = options.url;
      const args = _url.split('/');
      const id = args[args.length - 2];
      return this.parsePhotoInfo(id);
    }
    return {
      videoUrl,
      desc,
      cover,
      mp3Url,
      pics,
      user,
      type,
    };
  }
  async parsePhotoInfo(id: string) {
    let videoUrl, desc, cover, mp3Url, pics, user;
    const { html: result } = await getHtmlWith302(
      `${this.config.photoReqUrl}?item_ids=${id}`,
    );
    const ret = JSON.parse(result);
    try {
      const data = ret['item_list'][0];
      desc = data['desc'];
      mp3Url = data['music']['play_url']['uri'];
      pics = data['images'].map(item => {
        return item['url_list'].find(img => img.indexOf('.webp') === -1);
      });
    } catch (e) {
      console.log(e);
      videoUrl = desc = cover = mp3Url = '';
    }
    return { videoUrl, desc, cover, mp3Url, pics, user };
  }
  _findDesObj(pageInfo) {
    const keys = Object.keys(pageInfo);
    let desObj = {};
    keys.forEach(key => {
      if (pageInfo[key]['defaultData']) {
        desObj = pageInfo[key];
      }
    });
    return desObj;
  }
  async getProductList(user: string, size = 9, max = '0') {
    const url = `${
      this.config.productListUrl
    }?sec_uid=${user}&count=${size}&max_cursor=${max}&_signature=${generateSignature(
      user,
    )}`;

    const { html } = await getHtmlWith302(url);
    const json = JSON.parse(html);

    const hasMore = json['has_more'];
    const maxCursor = json['max_cursor'];
    const list = json['aweme_list'];
    const productList = list.map(item => {
      const cover = item['video']['cover']['url_list'][0];
      const videoUrl = item['video']['play_addr']['url_list'][0];
      const awemeType = item['aweme_type'];
      return {
        desc: item['desc'],
        cover,
        productId: item['aweme_id'],
        contentLink: `https://www.iesdouyin.com/share/video/${item['aweme_id']}/`,
        author: item['author'],
        videoUrl: awemeType === 2 ? '' : videoUrl,
      };
    });

    const ret = {
      hasMore,
      max: maxCursor,
      productList,
    };

    return ret;
  }
}
