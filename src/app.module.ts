import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SpiderphotoModule } from './modules/spiderphoto/spiderphoto.module';

@Module({
  imports: [SpiderphotoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
