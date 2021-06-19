import { Controller, Get, Query } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { ApiService } from './api.service';

@Controller('/smart-photo/api')
export class ApiController {
  constructor(private readonly api: ApiService) {}
  @Get('/getHotDaliy')
  async getHotDaliy(@Query() query: any) {
    const { version = '0' } = query;
    const photos = await this.api.getHotDaliy(version);
    return photos;
  }

  @Get('/getAllCateData')
  async getAllCateData(@Query() query: any) {
    const { version = '0' } = query;
    return this.api.getAllCateData(version);
  }

  @Get('/getCateDataPage')
  async getCateDataPage(@Query() query: any) {
    const { cate, pno = 0, version = '0' } = query;
    return this.api.getCateDataPage(cate, pno, version);
  }

  @Get('/getDetail')
  async getDetail(@Query() query: any) {
    const { id, version = '0' } = query;
    return this.api.getDetail(id, version);
  }
}
