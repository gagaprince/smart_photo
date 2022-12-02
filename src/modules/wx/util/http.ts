const charset = require('superagent-charset');
const superagentC = charset(require('superagent'));

interface IHeaders {
  [propName: string]: string;
}

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

export const getJSON = async (
  url: string,
  headers?: IHeaders,
): Promise<any> => {
  const text = await getHtml(url, headers);
  if (text) {
    return JSON.parse(text);
  }
  return null;
};
