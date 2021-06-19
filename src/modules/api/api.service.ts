import { Injectable } from '@nestjs/common';
import { DbService, IPhotoDetail } from '../db/db.service';

export interface ICateData {
  cate: string;
  infos: IPhotoDetail[];
}

@Injectable()
export class ApiService {
  constructor(private readonly db: DbService) {}
  async getHotDaliy(version: string) {
    let photos = await this.db.selectHotDaliy();
    if (photos && photos.length >= 8) {
      // return this.shuffleSliceArr(photos, 8);
      photos = photos.slice(0, 8);
    }
    if (version == '1') {
      return this.proxyUrl(photos, '150x150,sc/');
    } else {
      return photos;
    }
  }

  async getAllCateData(version: string): Promise<ICateData[]> {
    // const cates = await this.db.selectAllCate();
    // console.log(cates);
    const cates = ['清纯美女', '古装美女', '性感美女', '香车美人', '丝袜美女'];
    // const cates = ['生态摄影', '创意家居', '花卉图片', '创意广告'];
    const cateDatas: ICateData[] = [];
    for (let i = 0; i < cates.length; i++) {
      const cate = cates[i];
      const data = await this.db.selectCateData(cate);
      const cateData: ICateData = {
        cate,
        infos:
          version == '1'
            ? this.proxyUrl(data.slice(0, 6), '320x320,sc/')
            : data.slice(0, 6),
      };
      cateDatas.push(cateData);
    }
    return cateDatas;
  }

  public async getDetail(id: number, version): Promise<IPhotoDetail[]> {
    const photo = await this.db.selectById(id);
    if (photo) {
      const photos = await this.db.selectByTitle(photo.title);
      return version == '1' ? this.proxyUrl(photos, '750x/') : photos;
    }
    return null;
  }

  public async getCateDataPage(cate: string, pno: number, version: string) {
    const psize = 20;
    const offset = pno * psize;
    const photos = await this.db.selectCateDataPage(cate, offset, psize);
    return version == '1' ? this.proxyUrl(photos, '320x320,sc/') : photos;
  }

  private shuffleSliceArr(arr: any[], num: number) {
    return this.shuffle(arr).slice(0, num);
  }

  private shuffle(arr: any[]) {
    for (var i = arr.length - 1; i >= 0; i--) {
      var randomIdx = Math.floor(Math.random() * (i + 1));
      var itemAtIdx = arr[randomIdx];
      arr[randomIdx] = arr[i];
      arr[i] = itemAtIdx;
    }
    return arr;
  }

  private proxyUrl(photos: IPhotoDetail[], fit: string) {
    return photos.map(photo => {
      photo.url = `https://ip.webmasterapi.com/api/imageproxy/${fit}${photo.url}`;
      return photo;
    });
  }
}
