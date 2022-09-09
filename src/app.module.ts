import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { SpiderphotoModule } from './modules/spiderphoto/spiderphoto.module';
// import { ApiModule } from './modules/api/api.module';
import { SmallvideoService } from './modules/smallvideo/smallvideo.service';
import { SmallvideoController } from './modules/smallvideo/smallvideo.controller';
import { SmallvideoModule } from './modules/smallvideo/smallvideo.module';
import { WordsModule } from './modules/words/words.module';

@Module({
  // imports: [SpiderphotoModule, ApiModule, SmallvideoModule],
  imports: [SmallvideoModule, WordsModule],
  controllers: [AppController, SmallvideoController],
  providers: [AppService, SmallvideoService],
})
export class AppModule {}
