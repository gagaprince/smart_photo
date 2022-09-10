import { Injectable } from '@nestjs/common';
import { DBService, ILessonInfo, IWord } from './db.service';

export interface ILessonTagMap {
  [key: string]: ILessonInfo[];
}

export interface ILessonDetailMap {
  [key: string]: ILesson;
}

export interface IWordMap {
  [key: string]: IWord;
}

export interface ILevelInfo {
  levelName: string;
  unitNames: string[];
}

export interface ILesson {
  bookName: string;
  levelInfos: ILevelInfo[];
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

  async searchLessonDetail(lessons: string[]): Promise<ILessonDetailMap> {
    const lessonDatas = await this.db.selectLessonDetail(lessons);
    const lessonDataMap: ILessonDetailMap = {};
    const levelDataMap = {};
    lessonDatas.forEach(lessonData => {
      const bookName = lessonData.book_name;
      const levelName = lessonData.level_name;
      const unitName = lessonData.unit_name;
      if (!lessonDataMap[bookName]) {
        lessonDataMap[bookName] = {
          bookName,
          levelInfos: [],
        };
      }
      if (!levelDataMap[bookName + levelName]) {
        const levelData: ILevelInfo = {
          levelName,
          unitNames: [],
        };
        lessonDataMap[bookName].levelInfos.push(levelData);
        levelDataMap[bookName + levelName] = levelData;
      }
      if (unitName) {
        levelDataMap[bookName + levelName].unitNames.push(unitName);
      }
    });
    return lessonDataMap;
  }

  async searchWordListByLesson(lesson, level, unit): Promise<string[]> {
    const lessonData = await this.db.selectLessonWords(lesson, level, unit);
    if (lessonData && lessonData.length) {
      const words = lessonData[0].words || '';
      return words.split(',');
    }
    return [];
  }

  async searchWordDetail(words: string[]): Promise<IWordMap> {
    const wordDetails = await this.db.selectWordDetailByWords(words);
    const wordMap: IWordMap = {};
    wordDetails.forEach(wordDetail => {
      const { word } = wordDetail;
      wordMap[word] = wordDetail;
    });
    return wordMap;
  }
}
