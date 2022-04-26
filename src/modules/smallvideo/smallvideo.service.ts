import { Injectable } from '@nestjs/common';
import { config4DY } from './config';
import cheerio from 'cheerio';
import superagent from 'superagent';
const charset = require('superagent-charset');
const superagentC = charset(require('superagent'));

interface IVideoData {
    videoUrl: string;
    cover?: string;
    desc?: string;
    mp3Url?: string;
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

    async parseDouyinVideoInfoByUrl(url: string): Promise<IVideoData> {
        const headers = config4DY.headers;
        headers['Referer'] = url;
        const html = await this.getHtml(url);
        const $ = cheerio.load(html);
        const pageInfo = JSON.parse(decodeURIComponent($('#RENDER_DATA').html()||'{}'));
        console.log(pageInfo);

        // 解析vedioUrl 
        let videoUrl,desc,cover,mp3Url;
        try{
            videoUrl = pageInfo['48']['aweme']['detail']['video']['playAddr'][0]['src'];
            desc = pageInfo['48']['aweme']['detail']['desc'];
            cover = pageInfo['48']['aweme']['detail']['video']['coverUrlList'][0];
            mp3Url = pageInfo['48']['aweme']['detail']['music']['playUrl']['urlList'][0];
        }catch(e){
            console.log(e);
            videoUrl = desc = cover = mp3Url = '';
        }
    
        return {
            videoUrl,
            desc,
            cover,
            mp3Url
        };
    }
    async test(){
        // const ret = await superagentC.get('https://v.douyin.com/FLUJfUH').charset('utf-8');
        // console.log(ret);
        return '';
    }
}
