import { Controller, Get, Query } from '@nestjs/common';
import { SpiderphotoService } from './spiderphoto.service';

@Controller('/smart-photo/spiderphoto')
export class SpiderphotoController {
  constructor(private readonly spiderService: SpiderphotoService) {}
  @Get('/start')
  async startSpider() {
    const ret = this.spiderService.start();
    return ret;
  }
}
