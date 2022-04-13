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
    // this.mysql = Mysql.createConnection({
    //   host: '127.0.0.1',
    //   user: 'root',
    //   password: 'root',
    //   database: 'smart_photo',
    // });
    const { MYSQL_USERNAME, MYSQL_PASSWORD, MYSQL_ADDRESS = '' } = process.env;
    const [host, port] = MYSQL_ADDRESS.split(':');

    this.mysql = Mysql.createConnection({
      host,
      user: MYSQL_USERNAME,
      password: MYSQL_PASSWORD,
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

  async selectPhotosByTitle(title: string): Promise<IPhotoDetail[]> {
    return this.mysql
      .table('photo_detail')
      .field('title')
      .where({ title: title })
      .select();
  }

  public select() {
    console.log('select');
  }

  public async selectHotDaliy(): Promise<IPhotoDetail[]> {
    return this.selectHotDataPage(0, 20);
  }

  public async selectHotDataPage(
    offset: number,
    rows: number,
  ): Promise<IPhotoDetail[]> {
    return (
      this.mysql
        .table('photo_detail')
        .field('id, title,url,bigcate,rank')
        //   .where({ bigcate: '风景摄影图片' })
        .where({
          bigcate: ['IN', '清纯美女,古装美女,性感美女,香车美人,丝袜美女'],
        })
        .group('title')
        .order('id desc')
        .limit(offset, rows)
        .select()
    );
  }

  public async selectCateData(cate: string): Promise<IPhotoDetail[]> {
    return this.selectCateDataPage(cate, 0, 20);
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
      .order('id desc')
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
