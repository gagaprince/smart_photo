import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { SmallvideoService } from './smallvideo.service';

@Controller('smallvideo')
export class SmallvideoController {
    constructor(private readonly smallvideoService: SmallvideoService) {}
    @Get('/testSmallVideo')
    testSmallVideo(@Query() query: any) {
        this.smallvideoService.test();
        return 'testSmallVideo';
    }

    @Post('/douyin')
    async douyin(@Body('url') url: string ): Promise<any> {
        const ret = await this.smallvideoService.parseDouyinVideoInfoByUrl(url);
        return ret;
    }
}
