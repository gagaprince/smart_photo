/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from '@nestjs/common';
const Mysql = require('node-mysql-promise');

export interface IWord {
  id?: number;
  word: string;
  word_zn: string;
  yinbiao?: string;
  voice?: string;
  pic?: string;
  sentence?: string;
  video?: string;
  captions?: string;
  multi_mean?: string;
  cixing?: string;
  more_sentence?: string;
  synonym_word?: string;
  cixing_change?: string;
  fast_remember?: string;
}

export interface ILesson {
  id?: number;
  book_name?: string;
  level_name?: string;
  unit_name?: string;
  words?: string;
  ctime?: number;
  utime?: number;
}

export interface ILessonInfo {
  id?: number;
  book_name: string;
  book_img: string;
  book_tag: string;
  book_render_name: string;
}

export interface IStudyPlan {
  id?: number;
  openid?: string;
  book?: string;
  level?: string;
  unit?: string;
  total_lesson?: number;
  current_lesson?: number;
  current_lesson_rate?: number;
  ctime?: number;
  utime?: number;
  study_status?: number;
  hold_words?: string;
  new_words?: string;
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
  async selectLessonDetail(lessons: string[]): Promise<ILesson[]> {
    return this.mysql
      .table('lesson')
      .field('id, book_name,level_name,unit_name,words')
      .where({
        book_name: ['IN', lessons],
      })
      .select();
  }
  async selectLessonWords(
    lesson: string,
    level: string,
    unit: string,
  ): Promise<ILesson[]> {
    return this.mysql
      .table('lesson')
      .field('id, words')
      .where({
        book_name: lesson,
        level_name: level,
        unit_name: unit,
      })
      .select();
  }

  async selectWordDetailByWords(words: string[]): Promise<IWord[]> {
    return this.mysql
      .table('words_en')
      .where({
        word: ['IN', words],
      })
      .select();
  }

  async selectPlanByUser(openid: string, study_status: number) {
    const rets = await this.mysql
      .table('study_plan')
      .where({
        openid,
        study_status,
      })
      .select();
    if (rets && rets.length) {
      return rets[0];
    }
    return;
  }
}
