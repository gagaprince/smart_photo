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

    @Post('/douyinProduct')
    async douyinProductList(@Body('user') user: string, @Body('psize') size:number, @Body('max') max:number, ): Promise<any>{
        const ret = await this.smallvideoService.getDouYinProductList(user,size,max);
        return ret;
    }

    @Post('/kuaishou')
    async kuaishou(@Body('url') url: string ): Promise<any> {
        const ret = await this.smallvideoService.parseKuaiShouVideoInfoByUrl(url);
        return ret;
    }

    @Post('/douyinDownload')
    async douyinDownload(@Body('url') url: string, @Body('filePath') filePath: string){
        const ret = await this.smallvideoService.douyinDownload(url, filePath);
        return ret;
    }
}
