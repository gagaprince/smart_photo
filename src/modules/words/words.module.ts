import { Module } from '@nestjs/common';
import { WordsService } from './words.service';
import { DBService } from './db.service';
import { WordsController } from './words.controller';

@Module({
  providers: [WordsService, DBService],
  controllers: [WordsController],
})
export class WordsModule {}
