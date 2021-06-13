import { Module } from '@nestjs/common';
import { SpiderphotoService } from './spiderphoto.service';
import { SpiderphotoController } from './spiderphoto.controller';
import { DbModule } from '../db/db.module';

@Module({
  imports: [DbModule],
  providers: [SpiderphotoService],
  controllers: [SpiderphotoController],
})
export class SpiderphotoModule {}
