import { Controller, Get, Query } from '@nestjs/common';
import { SpiderphotoService } from './spiderphoto.service';

@Controller('/smart-photo/spiderphoto')
export class SpiderphotoController {
  constructor(private readonly spiderService: SpiderphotoService) {}
  @Get('/startAll')
  async startSpider() {
    const ret = this.spiderService.start();
    return ret;
  }

  @Get('/startDaily')
  async startSpiderDaily() {
    // 每日更新
    const ret = this.spiderService.startDaliy();
    return ret;
  }
}
