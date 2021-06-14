import { Module } from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiController } from './api.controller';
import { DbModule } from '../db/db.module';

@Module({
  imports: [DbModule],
  providers: [ApiService],
  controllers: [ApiController],
})
export class ApiModule {}
