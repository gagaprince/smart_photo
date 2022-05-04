import { Injectable } from '@nestjs/common';
import { config4DY, config4KS } from './config';
import cheerio from 'cheerio';
import superagent from 'superagent';
import { generateSignature } from './util/sign';
import { getMd5, changeMd5 } from './util/mp4Util';
let request = require('request');
const charset = require('superagent-charset');
const superagentC = charset(require('superagent'));
const download = require('download');
const path = require('path');
const fs = require('fs');

request = request.defaults({jar: true});

interface IVideoData {
    videoUrl?: string;
    cover?: string;
    desc?: string;
    mp3Url?: string;
    pics?: string[];
    user?:string;
}

interface IProduct{
    desc?: string;
    cover?: string;
    productId: string;
    author?: any;
    videoUrl?: string;
}

interface IProductData{
    productList: IProduct[];
    max: number;
    hasMore: boolean;
}

interface IHeaders {
    [propName: string]: string;
  }

@Injectable()
export class SmallvideoService {
    async getHtml(url: string, headers?: IHeaders): Promise<string> {
        let request = superagentC.get(url).charset('utf-8');
        if (headers) {
            request = request.set(headers);
        }
        const result: any = await request.catch((e: any) => {
            console.log(e.status);
            return new Promise(res => {
            setTimeout(() => {
                res(this.getHtml(url, headers));
            }, 3000);
            });
        });
        return result && result.text;
    }

    _findDesObj(pageInfo){
        const keys = Object.keys(pageInfo);
        let desObj = {};
        keys.forEach((key)=>{
            if(pageInfo[key]['aweme']){
                desObj = pageInfo[key];
            }
        });
        return desObj;
    }

    async parseDouyinPhotoInfo(id:string): Promise<IVideoData>{
        let videoUrl,desc,cover,mp3Url,pics,user;
        const {html:result} = await this.getHtmlWith302(`${config4DY.photoReqUrl}?item_ids=${id}`);
        const ret = JSON.parse(result);
        try{
            const data = ret['item_list'][0];
            desc = data['desc'];
            mp3Url = data['music']['play_url']['uri'];
            pics = data['images'].map((item)=>{
                return item['url_list'].find((img)=>img.indexOf('.webp')===-1);
            })
        }catch(e){
            console.log(e);
            videoUrl = desc = cover = mp3Url = '';
        }
        return {videoUrl,desc,cover,mp3Url,pics,user};
    }

    async parseDouyinVideoInfoByUrl(url: string): Promise<IVideoData> {
        const headers = config4DY.headers;
        headers['Referer'] = url;

        // const html = await this.getHtml(url);
        const {html, options} = await this.getHtmlWith302(url,headers);
        let videoUrl,desc,cover,mp3Url,pics,user;
        if(options.url.indexOf('www.iesdouyin.com')===-1){
            if(/www.douyin.com\/user/g.test(options.url)){
                const path = options.url.split('?')[0];
                const args = path.split('/');
                user = args[args.length-1];
            }else{
                const $ = cheerio.load(html);
                const pageInfo = JSON.parse(decodeURIComponent($('#RENDER_DATA').html()||'{}'));
                const desObj = this._findDesObj(pageInfo);
        
                // 解析vedioUrl 
                try{
                    videoUrl = `https:${desObj['aweme']['detail']['video']['playAddr'][0]['src']}`;
                    desc = desObj['aweme']['detail']['desc'];
                    cover = desObj['aweme']['detail']['video']['coverUrlList'][0];
                    mp3Url = desObj['aweme']['detail']['music']['playUrl']['urlList'][0];
                }catch(e){
                    console.log(e);
                    videoUrl = desc = cover = mp3Url = '';
                }
                if(videoUrl.indexOf('.mp3')!==-1){
                    const _url = options.url.split('?')[0];
                    const args = _url.split('/');
                    const id = args[args.length-1];
                    return this.parseDouyinPhotoInfo(id);
                }
            }
        }else{
            // 图片的分支
            const _url = options.url;
            const args = _url.split('/');
            const id = args[args.length-2];
            return this.parseDouyinPhotoInfo(id);
            // const {html:result} = await this.getHtmlWith302(`${config4DY.photoReqUrl}?item_ids=${id}`);
            // console.log(result);
            // const ret = JSON.parse(result);
            // try{
            //     const data = ret['item_list'][0];
            //     desc = data['desc'];
            //     mp3Url = data['music']['play_url']['uri'];
            //     pics = data['images'].map((item)=>{
            //         return item['url_list'].find((img)=>img.indexOf('.webp')===-1);
            //     })
            // }catch(e){
            //     console.log(e);
            //     videoUrl = desc = cover = mp3Url = '';
            // }
        }
        return {
            videoUrl,
            desc,
            cover,
            mp3Url,
            pics,
            user
        };
        
    }

    async getDouYinProductList(user:string, size = 9, max = 0): Promise<IProductData>{
        const url = `${config4DY.productListUrl}?sec_uid=${user}&count=${size}&max_cursor=${max}&_signature=${generateSignature(user)}`;
        console.log(url);

        const {html} = await this.getHtmlWith302(url);
        const json = JSON.parse(html);

        const hasMore = json['has_more'];
        const maxCursor = json['max_cursor'];
        const list = json['aweme_list'];
        const productList = list.map((item)=>{
            const cover = item['video']['cover']['url_list'][0];
            const videoUrl = item['video']['play_addr']['url_list'][0];
            return {
                desc:item['desc'],
                cover,
                productId:item['aweme_id'],
                author:item['author'],
                videoUrl
            }
        })

        const ret = {
            hasMore,
            max:maxCursor,
            productList,
        }

        return ret;
    }

    async _request(options): Promise<any> {
        return new Promise((res,rej)=>{
            request(options, (err, response, body)=>{
                if(err) rej(err);
                if (response.statusCode==302) {
                    const cookie = response.headers['set-cookie'];
                    if(cookie){
                        options.headers.Cookie = cookie;
                    }
                    options.url = response.headers['location']||'';
                    if(options.url.indexOf('//')===0){
                        options.url = `https:${options.url}`;
                    }
                    options.headers['Referer'] = options.url;
                    console.log(response.headers);
                    console.log(options);
                    res(this._request(options));
                }else{
                    res(body);
                }
            });
        });
    }

    async getHtmlWith302(url:string, headers?:IHeaders): Promise<any> {
        const options = {
            url,
            headers,
            followRedirect: false,
        }
        const ret = await this._request(options);

        return {html:ret,options};
    }

    getTextByReg(reg, text, flag=false){
        const r = new RegExp(reg);
        console.log(text);
        console.log('-------------');
        const attr = r.exec(text);
        const ret = attr && attr[1];
        if(ret){
            if(flag){
                return ret;
            }
            return decodeURIComponent(JSON.parse(`"${ret}"`));
        }
        return '';
    }

    async parseKuaiShouVideoInfoByUrl(url:string): Promise<IVideoData> {
        const {html} = await this.getHtmlWith302(url,{
            'user-agent': config4KS.headers['User-Agent'],
            'Referer': url,
        });
        const text = html;
        const videoUrl = this.getTextByReg(config4KS.videoReg, text);
        const cover = this.getTextByReg(config4KS.coverReg, text);
        const desc = this.getTextByReg(config4KS.descReg, text);
        const picstr = this.getTextByReg(config4KS.picsReg,text,true);
        const domain = this.getTextByReg(config4KS.imgCDNReg,text);
        const pics = JSON.parse(`[${picstr}]`||'[]').map((item)=>{
            return `https://${domain}${item.path}`;
        });
        
        return {
            videoUrl,cover,desc,mp3Url:'',pics
        };

    }


    async test(){
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

        await this.douyinDownload('https://v.douyin.com/FjFy9JX/', '/Users/wangzidong/Documents/随时可删/test/丸糯');


        return '';
    }

    async douyinDownloadByUser(user:string, filePath:string){
        const psize = 10;
        let max = 0;
        for(let i=0;i<200;i++){
            const ret = await this.getDouYinProductList(user,psize,max);
            console.log(ret);
            const productList = ret.productList || [];
            // productList.forEach((product) => {

            // });

            for(let j=0;j< productList.length; j++){
                const {videoUrl,productId,desc} = productList[j];
                // await download(videoUrl, path.join(filePath,`${productId}.mp4`));
                // await download(videoUrl, filePath);
                fs.writeFileSync(path.join(filePath,`${productId}.mp4`), await download(videoUrl));
                console.log(`下载完成----${desc}`); 
            }

            if(!ret.hasMore){
                break;
            }
            max = ret.max;
        }
        
    }

    async douyinDownload(url:string, filePath:string):Promise<any>{

        const { user } = await this.parseDouyinVideoInfoByUrl(url);
        if(user){
            this.douyinDownloadByUser(user,filePath);
        }
        return '';
    }
}
