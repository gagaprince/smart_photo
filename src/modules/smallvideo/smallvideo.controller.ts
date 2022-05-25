import { Controller, Get, Query, Post, Body, HttpCode } from '@nestjs/common';
import { SmallvideoService } from './smallvideo.service';

@Controller('smallvideo')
export class SmallvideoController {
  constructor(private readonly smallvideoService: SmallvideoService) {}
  @Get('/testSmallVideo')
  async testSmallVideo(@Query() query: any): Promise<any> {
    const ret = await this.smallvideoService.test();
    return ret;
  }

  @HttpCode(200)
  @Post('/all')
  async all(@Body('content') content: string): Promise<any> {
    const ret = await this.smallvideoService.parseWithContent(content);
    return ret;
  }

  @HttpCode(200)
  @Post('/userAll')
  async userAll(
    @Body('type') type: string,
    @Body('user') user: string,
    @Body('psize') size: number,
    @Body('max') max: string,
    @Body('refer') refer: string,
  ): Promise<any> {
    if (type === 'douyin') {
      const ret = await this.smallvideoService.getDouYinProductList(
        user,
        size,
        max,
      );
      return ret;
    } else if (type === 'kuaishou') {
      const ret = await this.smallvideoService.getKuaishouProductList(
        user,
        size,
        max,
        refer,
      );
      return ret;
    }
    return '';
  }

  @HttpCode(200)
  @Post('/douyin')
  async douyin(@Body('url') url: string): Promise<any> {
    const ret = await this.smallvideoService.parseDouyinVideoInfoByUrl(url);
    return ret;
  }

  @Post('/douyinProduct')
  async douyinProductList(
    @Body('user') user: string,
    @Body('psize') size: number,
    @Body('max') max: string,
  ): Promise<any> {
    const ret = await this.smallvideoService.getDouYinProductList(
      user,
      size,
      max,
    );
    return ret;
  }

  @Post('/kuaishou')
  async kuaishou(@Body('url') url: string): Promise<any> {
    const ret = await this.smallvideoService.parseKuaiShouVideoInfoByUrl(url);
    return ret;
  }

  @Post('/douyinDownload')
  async douyinDownload(
    @Body('url') url: string,
    @Body('filePath') filePath: string,
  ) {
    const ret = await this.smallvideoService.douyinDownload(url, filePath);
    return ret;
  }
}
