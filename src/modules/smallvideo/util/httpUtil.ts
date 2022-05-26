const charset = require('superagent-charset');
const superagentC = charset(require('superagent'));
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
  const ret = await _request(options);

  return { html: ret, options };
};

export const getHtmlWith302OneStep = async (
  url: string,
  jar: boolean = true,
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
      if (response.statusCode == 302) {
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
      if (err) rej(err);
      if (response.statusCode == 302) {
        const cookie = response.headers['set-cookie'];
        if (cookie) {
          options.headers.Cookie = cookie;
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
