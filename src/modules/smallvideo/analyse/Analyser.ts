import cheerio from 'cheerio';
export interface IVideoData {
  videoUrl?: string;
  cover?: string;
  desc?: string;
  mp3Url?: string;
  pics?: string[];
  user?: string;
  type?: string;
  refer?: string;
  cookie?: string;
  query?: string;
}
export interface IProduct {
  desc?: string;
  cover?: string;
  productId: string;
  author?: any;
  videoUrl?: string;
  contentLink?: string;
}
export interface IProductData {
  productList: IProduct[];
  max: string;
  hasMore: boolean;
  refer?: string;
  cookie?: string;
}

export interface Analyser {
  parseVideoInfoByUrl: (url: string, cookie?: string) => Promise<IVideoData>;
  parsePhotoInfo: (id: string) => Promise<IVideoData>;
  getProductList: (
    user: string,
    size: number,
    max: string,
    refer?: string,
    cookie?: string,
  ) => Promise<IProductData>;
}

export abstract class BaseAnalyser implements Analyser {
  cheerio: any;
  constructor() {
    this.cheerio = cheerio;
  }
  abstract parseVideoInfoByUrl(url: string, cookie?: string);
  abstract parsePhotoInfo(id: string);
  abstract getProductList(
    user: string,
    size: number,
    max: string,
    refer?: string,
    cookie?: string,
  );
}
