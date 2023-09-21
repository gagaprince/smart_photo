const charset = require('superagent-charset');
const superagentC = charset(require('superagent'));
const https = require('https')
const URL = require('url')
let request = require('request');
request = request.defaults({ jar: true });

interface IHeaders {
  [propName: string]: string;
}

export const postHtml = async (
  url: string,
  headers?: IHeaders,
  data?: any,
): Promise<string> => {
  let request = superagentC.post(url).charset('utf-8');
  if (data) {
    request.send(data);
  }
  if (headers) {
    request = request.set(headers);
  }
  const result: any = await request.catch((e: any) => {
    console.log(e.status);
  });
  // console.log(result);
  return result && result.text;
};
export const getHtml = async (
  url: string,
  headers?: IHeaders,
): Promise<string> => {
  let request = superagentC.get(url).charset('utf-8');
  if (headers) {
    request = request.set(headers);
  }
  const result: any = await request.catch((e: any) => {
    return new Promise(res => {
      setTimeout(() => {
        res(getHtml(url, headers));
      }, 3000);
    });
  });
  return result && result.text;
};
export const getHtmlWith302 = async (
  url: string,
  headers?: any,
): Promise<any> => {
  const options = {
    url,
    headers,
    followRedirect: false,
  };
  // console.log('options',options);
  const ret = await _request(options);

  return { html: ret, options };
};

export const getHtmlWith302OneStep = async (
  url: string,
  jar = true,
  headers?: any,
) => {
  const options = {
    url,
    headers,
    followRedirect: false,
    jar,
  };
  const ret = await _requestOneStep(options);

  return { ...ret, options };
};

async function _requestOneStep(options): Promise<any> {
  return new Promise((res, rej) => {
    // console.log('options:', options);
    request(options, (err, response, body) => {
      if (err) {
        rej(err);
        return;
      }
      let cookie,
        location = '';
      const cookieArr = response.headers['set-cookie'];
      if (cookieArr) {
        cookie = cookieArr
          .map(cookieItem => cookieItem.split(' ')[0])
          .join(' ');
      }
      if (response.statusCode == 302 || response.statusCode == 307) {
        location = response.headers['location'] || '';
        if (options.url.indexOf('//') === 0) {
          location = `https:${options.url}`;
        }
      }
      res({
        statusCode: response.statusCode,
        response,
        body,
        cookie,
        location,
      });
    });
  });
}

async function _request(options): Promise<any> {
  return new Promise((res, rej) => {
    request(options, (err, response, body) => {
      if (err) {
        rej(err);
        return;
      }
      if (response.statusCode == 302) {
        const cookie = response.headers['set-cookie'];
        if (cookie) {
          options.headers.Cookie = options.headers.Cookie
            ? `${options.headers.Cookie} ${cookie}`
            : cookie;
        }
        options.url = response.headers['location'] || '';
        if (options.url.indexOf('//') === 0) {
          options.url = `https:${options.url}`;
        }
        options.headers['Referer'] = options.url;
        res(_request(options));
      } else {
        res(body);
      }
    });
  });
}

export async function simpleHttpsRequest(options):Promise<any> {
  const url = options.url;
  const urlObj = URL.parse(url)
  const { hostname, path } = urlObj;
  const agent = new https.Agent({});
  const opt = {
    hostname,
    path,
    method: options.method || 'GET',
    headers: options.headers,
    agent,
  }

  // console.log('opts:', opt);

  return new Promise((resolve, reject) => {
    const req = https.request(opt, (res) => {
      // console.log(`STATUS: ${res.statusCode}`) //返回状态码
      // console.log(`HEADERS: ${JSON.stringify(res.headers, null, 4)}`) // 返回头部
      res.setEncoding('utf8') // 设置编码
      res.on('data', (chunk) => { //监听 'data' 事件
          console.log(`主体: ${chunk}`)
          resolve({
            res,
            body: chunk,
          })
      })
    })
    req.on('error', (err) => {
      reject(err);
    })
    req.end() 
  });
}
