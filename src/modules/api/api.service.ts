import { Injectable } from '@nestjs/common';
import { DbService, IPhotoDetail } from '../db/db.service';

export interface ICateData {
  cate: string;
  infos: IPhotoDetail[];
}

@Injectable()
export class ApiService {
  constructor(private readonly db: DbService) {}
  async getHotDaliy() {
    const photos = await this.db.selectHotDaliy();
    if (photos && photos.length >= 8) {
      return this.shuffleSliceArr(photos, 8);
    }
    return [];
  }

  async getAllCateData(): Promise<ICateData[]> {
    const cates = await this.db.selectAllCate();
    console.log(cates);
    const cateDatas: ICateData[] = [];
    for (let i = 0; i < cates.length; i++) {
      const cate = cates[i];
      const data = await this.db.selectCateData(cate);
      const cateData: ICateData = {
        cate,
        infos: this.shuffleSliceArr(data, 6),
      };
      cateDatas.push(cateData);
    }
    return cateDatas;
  }

  public async getDetail(id: number): Promise<IPhotoDetail[]> {
    const photo = await this.db.selectById(id);
    if (photo) {
      return this.db.selectByTitle(photo.title);
    }
    return null;
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
}
