import { Controller, Get, Query } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { ApiService } from './api.service';

@Controller('/smart-photo/api')
export class ApiController {
  constructor(private readonly api: ApiService) {}
  @Get('/getHotDaliy')
  async getHotDaliy() {
    const photos = await this.api.getHotDaliy();
    return photos;
  }

  @Get('/getAllCateData')
  async getAllCateData() {
    return this.api.getAllCateData();
  }

  @Get('/getCateDataPage')
  async getCateDataPage(@Query() query: any) {
    const { cate, pno = 0 } = query;
    return this.api.getCateDataPage(cate, pno);
  }

  @Get('/getDetail')
  async getDetail(@Query() query: any) {
    const { id } = query;
    return this.api.getDetail(id);
  }
}
