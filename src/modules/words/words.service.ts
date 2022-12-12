/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable } from '@nestjs/common';
import { DBService, ILessonInfo, IStudyPlan, IWord } from './db.service';

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

  _groupArray(array: any[], subLength: number): any[][] {
    const ret = [];
    let index = 0;
    while (index < array.length) {
      ret.push(array.slice(index, (index += subLength)));
    }
    return ret;
  }

  // 检查是否有已经学过的 已经学过的 如果是已结束 则更新hold_words 和 new_words
  // 如果是已中断 则只改状态 继续学习就行
  // 如果没有学过 则创建新的plan
  async _createStudyPlanAfterCheck(lesson, level, unit = '', openid) {
    const hasCreatePlan = await this.db.selectPlanByLessonInfo(
      lesson,
      level,
      unit,
      openid,
    );
    // 查询对应课程的所有单词
    const allWordList = await this.searchWordListByLesson(lesson, level, unit);
    if (allWordList && allWordList.length) {
      const wordsArray = this._groupArray(allWordList, 10);
      if (hasCreatePlan) {
        const { study_status } = hasCreatePlan;
        if (study_status === 2) {
          // 已结束
          hasCreatePlan.total_lesson = wordsArray.length;
          hasCreatePlan.current_lesson = 0;
          hasCreatePlan.current_lesson_rate = 0;
          hasCreatePlan.hold_words = '';
          hasCreatePlan.new_words = wordsArray[0].join(',');
        }
        hasCreatePlan.utime = Date.now();
        hasCreatePlan.study_status = 1;
        // 更新此计划
        await this.db.updatePlan(hasCreatePlan);
        return hasCreatePlan;
      } else {
        const newCreatePlan: IStudyPlan = {
          book: lesson,
          level,
          unit,
          openid,
        };
        newCreatePlan.total_lesson = wordsArray.length;
        newCreatePlan.current_lesson = 0;
        newCreatePlan.current_lesson_rate = 0;
        newCreatePlan.hold_words = '';
        newCreatePlan.new_words = wordsArray[0].join(',');
        newCreatePlan.study_status = 1;
        newCreatePlan.ctime = Date.now();
        newCreatePlan.utime = Date.now();
        await this.db.insertPlan(newCreatePlan);
        return newCreatePlan;
      }
    } else {
      throw new Error('此课程没有单词');
    }
  }

  async createStudyPlan(lesson, level, unit = '', openid) {
    // 查看当前用户是否有已经在途的plan
    // 如果 book lesson 一致 则直接改状态
    // 如果 book lesson 不一致 返回前端提示 确认后 切换状态
    // 如果没有在途的plan 直接创建返回
    // 返回 当前plan
    const currentPlanArray = await this.db.selectPlanByUser(openid, 1);
    if (currentPlanArray && currentPlanArray.length) {
      const { book } = currentPlanArray[0];
      if (book === lesson) {
        // 修改currentPlan 状态为暂停
        currentPlanArray[0].study_status = 3; // 中断
        await this.db.updatePlan(currentPlanArray[0]);
      }
    }
    // 检测后创造新的plan
    return await this._createStudyPlanAfterCheck(lesson, level, unit, openid);
  }

  async learnedNewWordOnPlan(planId, openidOut, word) {
    // 查出这个planId 对应的plan 对比openid是否正确 不正确则抛出异常
    // 正确的话 就重新设置一个新老词 然后 update
    const plan = await this.db.selectPlanById(planId);
    if (plan) {
      const { openid, new_words, hold_words } = plan;
      if (openid === openidOut) {
      }
    }
    throw new Error('没有此计划，或者没有权限');
  }
}
