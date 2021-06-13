import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { beginAllSpider } from './tpzj/spiderTPZJ';

export interface ISpiderResult {
  isSpider: boolean;
  msg?: string;
}

@Injectable()
export class SpiderphotoService {
  private isSpider = false;
  constructor(private readonly db: DbService) {}
  public start(): ISpiderResult {
    if (!this.isSpider) {
      this.excuteSpider();
    }
    return { isSpider: this.isSpider };
  }

  public excuteSpider() {
    beginAllSpider(this.db).then(() => {
      this.isSpider = false;
    });
    this.isSpider = true;
  }
}
