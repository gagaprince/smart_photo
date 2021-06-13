import { Injectable } from '@nestjs/common';
const Mysql = require('node-mysql-promise');

export interface IPhotoDetail {
  title: string;
  url: string;
  bigcate: string;
  rank: number;
  c_time: number;
  u_time: number;
}

@Injectable()
export class DbService {
  mysql: any;

  constructor() {
    this.mysql = Mysql.createConnection({
      host: 'localhost',
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
}
