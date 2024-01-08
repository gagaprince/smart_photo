const crypto = require('crypto');
import { BaseAnalyser } from './Analyser';
import { getHtmlWith302 } from '../util/httpUtil';
import { generateSignature } from '../util/sign';
const { sign } = require("../util/X-Bogus.js");
import axios from 'axios';

interface IttwidCache{
  time?: number;
  ttwid?: string;
}
export class DouyinAnalyserV2 extends BaseAnalyser {
  ttwidCache:IttwidCache = {};
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
    const regex = /self.__pace_f.push\((\[1,\"[a-z|0-9]:(?!.*self.__pace_f.push.*).*?roomInfo\\":\{\\"room\\".*?)\)<\/sc/;
    const matchResult = html.match(regex);
    
    const parameter = matchResult[1];
    // console.log('parameter: ',parameter)
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

  parseVid(url){
    try{
      let match = url.match(/video\/(\d+)\?/);
      return match ? match[1] : '';
    }catch(e){
      console.error(e);
    }
    return '';
  }

  msToken(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const randomBytes = crypto.randomBytes(length);
    return Array.from(randomBytes, (byte:any) => characters[byte % characters.length]).join('');
  }

  async getTtwid() {
    try {
      const url = 'https://ttwid.bytedance.com/ttwid/union/register/';
      const data = {
        "region": "cn",
        "aid": 1768,
        "needFid": false,
        "service": "www.ixigua.com",
        "migrate_info": { "ticket": "", "source": "node" },
        "cbUrlProtocol": "https",
        "union": true
      };
      const response = await axios.post(url, data, { headers: { 'Content-Type': 'application/json' } });
      const setCookie = response.headers['set-cookie'];
      const regex = /ttwid=([^;]+)/;
      const match = regex.exec(setCookie[0]);
      return match && match.length > 1 ? match[1] : '';
    } catch (error) {
      console.error(error);
      return '';
    }
  }

  async scheduleGetTtwid(){
    if(this.ttwidCache.ttwid && this.ttwidCache.time && Date.now() - this.ttwidCache.time < 6*3600000){
      return this.ttwidCache.ttwid;
    }
    const ttwid = await this.getTtwid();
    if(ttwid){
      this.ttwidCache.ttwid = ttwid;
      this.ttwidCache.time = Date.now();
    }

    return ttwid;
  }

  sign(url, userAgent){
    const query = url.includes("?") ? url.split("?")[1] : "";
    const xbogus = sign(query, userAgent);
    const newUrl = `${url}&X-Bogus=${xbogus}`;
    return newUrl;
  }

  async requestVideoInfo({vid,msToken,ttwid}){
    const headers = { ...this.config.headers };
    headers['Referer'] = 'https://www.douyin.com/';
    headers['Cookie'] = `msToken=${msToken};ttwid=${ttwid};`;
    console.log('cookie:', headers['Cookie']);
    const originUrl = `https://www.douyin.com/aweme/v1/web/aweme/detail/?aweme_id=${vid}&aid=1128&version_name=23.5.0&device_platform=android&os_version=2333`
    const url = this.sign(originUrl, headers['User-Agent']);
    console.log('urlLast:', url);

    return axios.get(url, {
      headers: headers,
      withCredentials: true,
    }).then(response => {
      console.log(response.status);
      if(response.status === 200){
        return response.data;
      }
      return {};
      
    }).catch(error => {
      console.error(error);
    });

  }

  async parseVideoInfoByUrl(url: string) {
    const headers = { ...this.config.headers };
    headers['Referer'] = url;
    headers['Cookie'] = '';

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
        console.log('短链解析到:', options.url);
        const vid = this.parseVid(options.url);
        console.log('vid:', vid);

        const msToken = this.msToken(107)
        console.log('msToken:', msToken);

        const ttwid = await this.scheduleGetTtwid();
        console.log('ttwid:', ttwid);

        const videoInfo = await this.requestVideoInfo({vid, msToken, ttwid});

        videoUrl = videoInfo.aweme_detail?.video?.play_addr?.url_list[0]||'';
        cover = videoInfo.aweme_detail?.video?.cover?.url_list[0] || '';
        user = videoInfo.aweme_detail?.author?.nickname || ''
        desc = videoInfo.aweme_detail?.desc || ''


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
