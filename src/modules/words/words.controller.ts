import { Controller, Get, Post, Query, Body } from '@nestjs/common';
import { WordsService } from './words.service';

@Controller('words')
export class WordsController {
  constructor(private readonly wordsService: WordsService) {}
  @Get('/test')
  async testSmallVideo(@Query() query: any): Promise<any> {
    return {
      query,
      pro: 'words',
      interface: 'test',
    };
  }

  @Get('/allLessons')
  async allLessons(@Query() query: any): Promise<any> {
    const { lessons = '小学,初中,高中,大学,推荐,其他' } = query;
    return this.wordsService.searchLessonByTags(lessons.split(','));
  }

  @Get('/lessonDetail')
  async lessonDetail(@Query() query: any): Promise<any> {
    const { books = '' } = query;
    if (books) {
      return this.wordsService.searchLessonDetail(books.split(','));
    }
    return {};
  }

  @Get('/wordListByLesson')
  async wordsListByLesson(@Query() query: any): Promise<any> {
    const { lesson = '', level = '', unit } = query;
    if (lesson && level) {
      const words = await this.wordsService.searchWordListByLesson(
        lesson,
        level,
        unit,
      );
      return { words };
    }
    return { words: [] };
  }

  @Post('/wordDetail')
  async wordDetail(@Body('words') words: string[]): Promise<any> {
    if (words) {
      return await this.wordsService.searchWordDetail(words);
    }
    return {};
  }

  @Get('/createStudyPlan')
  async createStudyPlan(@Body() body: any): Promise<any> {
    const { lesson = '', level = '', unit = '', openid } = body;
    if (lesson && level) {
      const { lesson = '', level = '', unit = '', openid } = body;
      await this.wordsService.createStudyPlan(lesson, level, unit, openid);
    } else {
      return {};
    }
  }
}
