import { Module } from '@nestjs/common';
import { WxController } from './wx.controller';
import { WxService } from './wx.service';
import { DBService } from './db.service';

@Module({
  controllers: [WxController],
  providers: [WxService, DBService],
})
export class WxModule {}
