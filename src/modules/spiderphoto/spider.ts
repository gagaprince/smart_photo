import superagent from 'superagent';
const charset = require('superagent-charset');
const superagentC = charset(require('superagent'));
export interface Anylyzer {
  anylyse: (html: string) => any;
}

interface IPostData {
  [propName: string]: any;
}

interface IHeaders {
  [propName: string]: string;
}

export default class Spider {
  constructor(private anylyzer: Anylyzer | null) {}

  async get(url: string, headers?: IHeaders) {
    let request = superagentC.get(url).charset('gbk');
    if (headers) {
      request = request.set(headers);
    }
    const result = await request.catch((e: any) => {
      return new Promise(res => {
        setTimeout(() => {
          res(this.get(url, headers));
        }, 3000);
      });
    });
    return (
      (this.anylyzer && this.anylyzer.anylyse((result && result.text) || '')) ||
      (result && result.text)
    );
  }

  async post(url: string, data: IPostData, headers: IHeaders) {
    const result = await superagent
      .post(url)
      .set(headers)
      .send(data)
      .catch(e => {
        return null;
      });
    return (
      (this.anylyzer && this.anylyzer.anylyse((result && result.text) || '')) ||
      (result && result.text)
    );
  }
}
