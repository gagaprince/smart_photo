import {
  PhotoIndexAnylyzer,
  PhotoOneTypeAnylyzer,
  PhotoOnePageAnylyzer,
  PhotoDetailPageAnylyzer,
} from './photoAnylyzers';
import Spider from '../spider';
import { DbService } from 'src/modules/db/db.service';

let dbs: DbService | undefined;

const parseIndex = async (url: string) => {
  const photoIndexAnylyzer = new PhotoIndexAnylyzer();
  const mySpider = new Spider(photoIndexAnylyzer);
  return await mySpider.get(url);
};

const parsePicPage = async (url: string, type: string, name: string) => {
  const photoDetailPageAnylyzer = new PhotoDetailPageAnylyzer();
  let nowUrl = url;
  const photos = await dbs.selectPhotosByTitle(name);
  if (photos && photos.length > 0) {
    console.log(`${name} 已存在 跳过爬取`);
    return; //如果库中已存在这个title直接跳过
  }
  console.log(`${name} 未入库 现在开始入库`);
  while (true) {
    const mySpider = new Spider(photoDetailPageAnylyzer);
    console.log(`单签采集详情页:${nowUrl}`);
    const { imgUrls, nextUrl, hot } = await mySpider.get(nowUrl);
    if (!imgUrls || !nextUrl) {
      continue;
    }
    for (let i = 0; i < imgUrls.length; i++) {
      const imgUrl = imgUrls[i];
      console.log(type, name, imgUrl, hot);
      if (dbs) {
        const now = new Date().getTime();
        dbs.savePhoto({
          url: imgUrl,
          title: name,
          bigcate: type,
          rank: hot,
          c_time: now,
          u_time: now,
        });
      }
    }

    if (nextUrl.indexOf('html') != -1) {
      const endTag = nowUrl.substring(nowUrl.lastIndexOf('/') + 1);
      nowUrl = nowUrl.replace(endTag, nextUrl);
    } else {
      break;
    }
  }
};

const parseOnePage = async (url: string, type: string) => {
  const photoOnePathAnylyzer = new PhotoOnePageAnylyzer();
  const mySpider = new Spider(photoOnePathAnylyzer);
  console.log(`套图分页url:${url}`);
  const picPageArray = await mySpider.get(url);
  for (let i = 0; i < picPageArray.length; i++) {
    const { picUrl, name } = picPageArray[i];
    console.log(picUrl, name);
    await parsePicPage(`https://www.tupianzj.com${picUrl}`, type, name);
  }
};

const parseOneType = async (url: string, type: string) => {
  const photoOneTypeAnylyzer = new PhotoOneTypeAnylyzer();
  const mySpider = new Spider(photoOneTypeAnylyzer);
  const { typeIndex, total } = await mySpider.get(url);
  for (let i = 1; i <= +total; i++) {
    const pageUrl = `${url}list_${typeIndex}_${i}.html`;
    console.log(pageUrl);
    await parseOnePage(pageUrl, type);
  }
};

export const beginAllSpider = async (dbService: DbService, url: string) => {
  dbs = dbService;
  // const indexUrlList = await parseIndex(
  //   // 'https://www.tupianzj.com/meinv/xiezhen/',
  //   'https://www.tupianzj.com/sheying/hunsha/',
  // );
  const indexUrlList = await parseIndex(url);
  for (let i = 0; i < indexUrlList.length; i++) {
    const { url, type } = indexUrlList[i];
    console.log(url, type);
    parseOneType(url, type);
  }
};

const parseOneTypeDaliy = async (url: string, type: string) => {
  const photoOneTypeAnylyzer = new PhotoOneTypeAnylyzer();
  const mySpider = new Spider(photoOneTypeAnylyzer);
  const { typeIndex } = await mySpider.get(url);
  for (let i = 1; i <= 2; i++) {
    //只采两页
    const pageUrl = `${url}list_${typeIndex}_${i}.html`;
    console.log(pageUrl);
    await parseOnePage(pageUrl, type);
  }
};

export const beginDaliySpider = async (dbService: DbService) => {
  dbs = dbService;
  const indexUrlList = await parseIndex(
    'https://www.tupianzj.com/meinv/xiezhen/',
  );
  for (let i = 0; i < indexUrlList.length; i++) {
    const { url, type } = indexUrlList[i];
    console.log(url, type);
    parseOneTypeDaliy(url, type);
  }
};
