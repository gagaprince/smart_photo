import { Injectable } from '@nestjs/common';
import { DBService, ILessonInfo } from './db.service';

export interface ILessonTagMap {
  [key: string]: ILessonInfo[];
}

@Injectable()
export class WordsService {
  constructor(private readonly db: DBService) {}
  async searchLessonByTags(tags: string[]): Promise<ILessonTagMap> {
    const lessonInfos = await this.db.selectLessonInfoByTags(tags);
    const lessenTagMap: ILessonTagMap = {};
    lessonInfos.forEach(lessonInfo => {
      const tag = lessonInfo.book_tag;
      if (!lessenTagMap[tag]) {
        lessenTagMap[tag] = [];
      }
      lessenTagMap[tag].push(lessonInfo);
    });
    return lessenTagMap;
  }
}
