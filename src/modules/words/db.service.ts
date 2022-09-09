/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from '@nestjs/common';
const Mysql = require('node-mysql-promise');

export interface IWord {
  id?: number;
}

export interface ILesson {
  id?: number;
  book_name: string;
  level_name: string;
  unit_name: string;
  words: string;
  ctime: number;
  utime: number;
}

export interface ILessonInfo {
  id?: number;
  book_name: string;
  book_img: string;
  book_tag: string;
  book_render_name: string;
}

@Injectable()
export class DBService {
  mysql: any;
  constructor() {
    this.mysql = Mysql.createConnection({
      host: '182.92.1.128',
      user: 'root',
      password: 'ilovelxh123',
      database: 'words',
    });
  }
  async selectLessonInfoByTags(tags: string[]): Promise<ILessonInfo[]> {
    return this.mysql
      .table('lesson_info')
      .field('id, book_name,book_img,book_tag,book_render_name')
      .where({
        book_tag: ['IN', tags],
      })
      .select();
  }
}
