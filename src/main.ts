import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { CommonExceptionFilter } from './filters/commonException.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new CommonExceptionFilter()); // 全局异常处理
  app.useGlobalInterceptors(new ResponseInterceptor()); // cat拦截器 response正常返回封装
  await app.listen(3000);
}
bootstrap();
