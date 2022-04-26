import { Module } from '@nestjs/common';
import { SmallvideoController } from './smallvideo.controller';
import { SmallvideoService } from './smallvideo.service';

@Module({
  controllers: [SmallvideoController],
  providers: [SmallvideoService]
})
export class SmallvideoModule {}
