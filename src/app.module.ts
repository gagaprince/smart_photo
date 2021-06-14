import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SpiderphotoModule } from './modules/spiderphoto/spiderphoto.module';
import { ApiModule } from './modules/api/api.module';

@Module({
  imports: [SpiderphotoModule, ApiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
