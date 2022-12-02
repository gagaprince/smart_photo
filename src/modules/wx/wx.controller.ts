import { Controller, Get, Query } from '@nestjs/common';
import { WxService } from './wx.service';

@Controller('wx')
export class WxController {
  constructor(private readonly wx: WxService) {}
  @Get('/test')
  async test(@Query() query: any) {
    const { appid } = query;
    return await this.wx.getTokenByAppId(appid);
  }

  @Get('/login')
  async login(@Query() query: any) {
    const { code, appid } = query;
    return await this.wx.getUserInfo(code, appid);
  }
  @Get('/mcc')
  async mcc(@Query() query: any) {
    const { key } = query;
    return await this.wx.getMccVal(key);
  }
}
