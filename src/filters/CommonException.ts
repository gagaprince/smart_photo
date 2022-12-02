export enum ErrorCode {
  SERVICE_ERROR = 100, // 服务错误
  GET_MINI_TOKEN_ERROR,
  GET_MINI_TOKEN_FROMURL_ERROR,
  GET_MINI_OPENID_FROMURL_ERROR,
}
export const ErrorType = {
  TIME_OUT: 'timeoutError',
  MINI_APP_ERROR: 'miniAppError',
};
export class CommonException implements Error {
  constructor(
    public name: string,
    public message: string,
    public code: ErrorCode,
  ) {}
}
