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
  async all(
    @Body('content') content: string,
    @Body('cookie') cookie: string = '',
  ): Promise<any> {
    const ret = await this.smallvideoService.parseWithContent(content, cookie);
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
    @Body('cookie') cookie: string,
  ): Promise<any> {
    const ret = await this.smallvideoService.getProductList(
      user,
      size,
      max,
      type,
      refer,
      cookie,
    );
    return ret;
  }

  @HttpCode(200)
  @Post('/douyin')
  async douyin(@Body('url') url: string): Promise<any> {
    const ret = await this.smallvideoService.parseVideoInfoByUrl('douyin', url);
    return ret;
  }
  @HttpCode(200)
  @Post('/douyinLive')
  async douyinLive(@Body('url') url: string): Promise<any> {
    const ret = await this.smallvideoService.parseStreamWithLink(url);
    return ret;
  }

  @Post('/douyinProduct')
  async douyinProductList(
    @Body('user') user: string,
    @Body('psize') size: number,
    @Body('max') max: string,
  ): Promise<any> {
    const ret = await this.smallvideoService.getProductList(
      user,
      size,
      max,
      'douyin',
    );
    return ret;
  }

  @Post('/kuaishou')
  async kuaishou(@Body('url') url: string): Promise<any> {
    const ret = await this.smallvideoService.parseVideoInfoByUrl(
      'kuaishou',
      url,
    );
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

  @HttpCode(200)
  @Post('/dyABogus')
  async dyABogus(
    @Body('url') url: string,
    @Body('ua') ua: string,
  ) {
    const ret = await this.smallvideoService.dyABogus(url, ua);
    return ret;
  }

  @Get('/test')
  async test(@Query() query: any): Promise<any> {
    return query;
  }
}
