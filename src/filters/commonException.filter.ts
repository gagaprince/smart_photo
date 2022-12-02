import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { CommonException } from './CommonException';
const catDebug = require('debug')('commonException:');

@Catch(CommonException)
export class CommonExceptionFilter implements ExceptionFilter {
  // constructor(app) {

  // }
  catch(exception: CommonException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const { code, message, name } = exception;
    const errorResponse = {
      data: null,
      message: message,
      code,
    };
    response.status(200);
    response.header('Content-Type', 'application/json; charset=utf-8');
    response.send(errorResponse);
  }
}
