import { Injectable } from '@nestjs/common';
const Mysql = require('node-mysql-promise');

export interface IPhotoDetail {
  id?: number;
  title?: string;
  url?: string;
  bigcate?: string;
  rank?: number;
  c_time?: number;
  u_time?: number;
}

@Injectable()
export class DbService {
  mysql: any;

  constructor() {
    this.mysql = Mysql.createConnection({
      host: 'gagalulu.wang',
      user: 'root',
      password: 'ilovelxh123',
      database: 'smart_photo',
    });
  }

  async savePhoto(photo: IPhotoDetail) {
    return this.mysql
      .table('photo_detail')
      .add(photo)
      .then(insertId => {
        console.log(insertId);
      })
      .catch(e => {
        console.log(e);
      });
  }

  public select() {
    console.log('select');
  }

  public async selectHotDaliy(): Promise<IPhotoDetail[]> {
    return this.selectCateData('清纯美女');
  }

  public async selectCateData(cate: string): Promise<IPhotoDetail[]> {
    return this.selectCateDataPage(cate, 0, 100);
  }

  public async selectCateDataPage(
    cate: string,
    offset: number,
    rows: number,
  ): Promise<IPhotoDetail[]> {
    return this.mysql
      .table('photo_detail')
      .field('id, title,url,bigcate,rank')
      .where({ bigcate: cate })
      .group('title')
      .order('rank desc')
      .limit(offset, rows)
      .select();
  }

  public async selectAllCate(): Promise<string[]> {
    return (
      await this.mysql
        .table('photo_detail')
        .field('bigcate')
        .group('bigcate')
        .select()
    ).map(item => item.bigcate);
  }

  public async selectById(id: number): Promise<IPhotoDetail | undefined> {
    return (
      await this.mysql
        .table('photo_detail')
        .field('id,title')
        .where({ id: id })
        .select()
    )[0];
  }

  public async selectByTitle(title: string): Promise<IPhotoDetail[]> {
    return await this.mysql
      .table('photo_detail')
      .field('id, title,url,bigcate,rank')
      .where({ title: title })
      .select();
  }
}
