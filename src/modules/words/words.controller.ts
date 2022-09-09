import { Controller, Get, Query } from '@nestjs/common';
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
}
