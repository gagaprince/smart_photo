import { Injectable } from '@nestjs/common';
import { config4All } from './config';
import { changeMd5 } from './util/mp4Util';
import { Analyser, IVideoData } from './analyse/Analyser';
import { DouyinAnalyser } from './analyse/DouyinAnalyser';
import { KuaishouAnalyser } from './analyse/KuaishouAnalyser';
const download = require('download');
const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');

@Injectable()
export class SmallvideoService {
  douyinAnalyser: Analyser;
  kuaishouAnalyser: Analyser;
  constructor() {
    this.douyinAnalyser = new DouyinAnalyser();
    this.kuaishouAnalyser = new KuaishouAnalyser();
  }
  _getRealLink(content: string): string {
    const contentReg = new RegExp(config4All.contentReg);
    const ret = contentReg.exec(content);
    if (ret && ret.length > 1) {
      return ret[1];
    }
    return '';
  }

  async parseWithContent(
    content: string,
    cookie?: string,
  ): Promise<IVideoData> {
    const realLink = this._getRealLink(content);
    if (realLink) {
      console.log(realLink);
      if (realLink.indexOf('douyin') !== -1) {
        return this.douyinAnalyser.parseVideoInfoByUrl(realLink, cookie);
      } else if (realLink.indexOf('kuaishou') !== -1) {
        return this.kuaishouAnalyser.parseVideoInfoByUrl(realLink, cookie);
      }
    }
    return {};
  }

  async getProductList(user, size, max, type, refer?, cookie?) {
    return (
      this.getAnalyserByType(type)?.getProductList(
        user,
        size,
        max,
        refer,
        cookie,
      ) || {}
    );
  }

  async parseVideoInfoByUrl(type, url) {
    return this.getAnalyserByType(type)?.parseVideoInfoByUrl(url) || {};
  }

  getAnalyserByType(type) {
    if (type === 'douyin') {
      return this.douyinAnalyser;
    } else if (type === 'kuaishou') {
      return this.kuaishouAnalyser;
    }
  }

  async test() {
    // const ret = await superagentC.get('https://v.douyin.com/FLUJfUH').charset('utf-8');
    // console.log(ret);
    // const ret = await this.parseKuaiShouVideoInfoByUrl('https://v.kuaishou.com/j5W4A1');
    // console.log(ret);
    // const sign = generateSignature('MS4wLjABAAAA3r5K8OAWNphoJG24Sj2H86TdPP7keWRU4355jyVeLZU');
    // console.log(sign);
    // const n = "v[x++]=\x10v[--x]\x10t.charCodeAt(b++)-32\x10function \x10return \x10))\x10++\x10.substr\x10var \x10.length\x10()\x10,b+=\x10;break;case \x10;break}".split("\x10");
    // const s = '\x13e(e,a,r){\x14(b[e]||(b[e]=t("x,y","\x14x "+e+" y"\x15)(r,a)}\x13a(e,a,r){\x14(k[r]||(k[r]=t("x,y","\x14new x[y]("+Array(r+1).join(",x[\x16y]")\x17(1)+")"\x15)(e,a)}\x13r(e,a,r){\x18n,t,s={},b=s.d=r?r.d+1:0;for(s["$"+b]=s,t=0;t<b;t\x16)s[n="$"+t]=r[n];for(t=0,b=s\x19=a\x19;t<b;t\x16)s[t]=a[t];\x14c(e,0,s)}\x13c(t,b,k){\x13u(e){v[x\x16]=e}\x13f\x1a{\x14g=\x12,t\x17ing(b\x1bg)}\x13l\x1a{try{y=c(t,b,k)}catch(e){h=e,y=l}}for(\x18h,y,d,g,v=[],x=0;;)switch(g=\x12){case 1:u(!\x11)\x1c4:\x10f\x1a\x1c5:u(\x13(e){\x18a=0,r=e\x19;\x14\x13\x1a{\x18c=a<r;\x14c&&u(e[a\x16]),c}}(\x11\x15\x1c6:y=\x11,u(\x11(y\x15\x1c8:if(g=\x12,l\x1a\x1bg,g=\x12,y===c)b+=g;else if(y!==l)\x14y\x1c9:\x10c\x1c10:u(s(\x11\x15\x1c11:y=\x11,u(\x11+y)\x1c12:for(y=f\x1a,d=[],g=0;g<y\x19;g\x16)d[g]=y.charCodeAt(g)^g+y\x19;u(String.fromCharCode.apply(null,d\x15\x1c13:y=\x11,h=delete \x11[y]\x1c14:\x10\x12\x1c59:u((g=\x12)?(y=x,v.slice(x-=g,y\x15:[])\x1c61:u(\x11[\x12])\x1c62:g=\x11,k[0]=65599*k[0]+k[1].charCodeAt(g)>>>0\x1c65:h=\x11,y=\x11,\x11[y]=h\x1c66:u(e(t[b\x16],\x11,\x11\x15\x1c67:y=\x11,d=\x11,u((g=\x11).x===c?r(g.y,y,k):g.apply(d,y\x15\x1c68:u(e((g=t[b\x16])<"<"?(b--,f\x1a):g+g,\x11,\x11\x15\x1c70:u(!1)\x1c71:\x10n\x1c72:\x10+f\x1a\x1c73:u(parseInt(f\x1a,36\x15\x1c75:if(\x11){b\x16\x1dcase 74:g=\x12<<16>>16\x1bg\x1c76:u(k[\x12])\x1c77:y=\x11,u(\x11[y])\x1c78:g=\x12,u(a(v,x-=g+1,g\x15\x1c79:g=\x12,u(k["$"+g])\x1c81:h=\x11,\x11[f\x1a]=h\x1c82:u(\x11[f\x1a])\x1c83:h=\x11,k[\x12]=h\x1c84:\x10!0\x1c85:\x10void 0\x1c86:u(v[x-1])\x1c88:h=\x11,y=\x11,\x10h,\x10y\x1c89:u(\x13\x1a{\x13e\x1a{\x14r(e.y,arguments,k)}\x14e.y=f\x1a,e.x=c,e}\x1a)\x1c90:\x10null\x1c91:\x10h\x1c93:h=\x11\x1c0:\x14\x11;default:u((g<<16>>16)-16)}}\x18n=this,t=n.Function,s=Object.keys||\x13(e){\x18a={},r=0;for(\x18c in e)a[r\x16]=c;\x14a\x19=r,a},b={},k={};\x14r'.replace(/[\x10-\x1f]/g, (function(e) {
    //     return n[15 & e.charCodeAt(0)]
    // }));
    // console.log(s);

    // const md5 = getMd5('/Users/wangzidong/Documents/随时可删/test/4c1da9ec613f456285bd21d6bfe330fd.mp4');
    // console.log(md5);
    // changeMd5('/Users/wangzidong/Documents/随时可删/test.mp4');

    // await this.douyinDownload(
    //   'https://v.douyin.com/FgWSXH4/',
    //   '/Users/gagaprince/Documents/临时存放随时可删/打鱼晒网/',
    // );

    // const ret = await this.parseWithContent(
    //   'https://v.kuaishou.com/l6TzMz 看了这么多快手，还是「沫沫」最好玩了！ 复制此消息，打开【快手】直接观看！',
    // );

    return this.kuaishouAnalyser.parseVideoInfoByUrl(
      //   'https://v.kuaishou.com/n2n8T4',
      'https://v.kuaishou.com/lBkkeU',
    );
  }

  async douyinDownloadByUser(user: string, filePath: string) {
    const psize = 10;
    let max = '0';
    fse.ensureDirSync(path.resolve(filePath));
    for (let i = 0; i < 200; i++) {
      const ret = await this.douyinAnalyser.getProductList(user, psize, max);
      console.log(ret);
      const productList = ret.productList || [];

      for (let j = 0; j < productList.length; j++) {
        const { videoUrl, productId, desc } = productList[j];
        if (videoUrl && videoUrl.indexOf('.mp3') == -1) {
          const file = path.join(
            filePath,
            `${productId}_${desc}.mp4`.replace('/', '_'),
          );
          const oldFile = path.join(filePath, `${productId}.mp4`);
          if (fse.pathExistsSync(file) || fse.pathExistsSync(oldFile)) {
            continue;
          }
          fs.writeFileSync(file, await download(videoUrl));
          changeMd5(file);
        } else {
          const { pics } = await this.douyinAnalyser.parsePhotoInfo(productId);
          if (pics && pics.length > 0) {
            for (let k = 0; k < pics.length; k++) {
              const file = path.join(
                filePath,
                `${productId}_${desc}_${k}.jpg`.replace('/', '_'),
              );
              const oldFile = path.join(filePath, `${productId}_${k}.jpg`);
              if (fse.pathExistsSync(file) || fse.pathExistsSync(oldFile)) {
                continue;
              }
              fs.writeFileSync(file, await download(pics[k]));
              changeMd5(file);
            }
          }
        }
        console.log(`下载完成----${desc}`);
      }

      if (!ret.hasMore) {
        break;
      }
      max = ret.max;
    }
  }

  async douyinDownload(url: string, filePath: string): Promise<any> {
    const { user, refer } = await this.douyinAnalyser.parseVideoInfoByUrl(url);
    if (user) {
      this.douyinDownloadByUser(user, filePath);
    }
    return '';
  }
}