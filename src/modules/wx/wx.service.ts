import { Injectable } from '@nestjs/common';
import {
  CommonException,
  ErrorCode,
  ErrorType,
} from 'src/filters/CommonException';
import { DBService, IUserInfo } from './db.service';

import { getHtml, getJSON } from './util/http';

@Injectable()
export class WxService {
  constructor(private readonly db: DBService) {}

  async getSecretByAppId(appid: string): Promise<string> {
    const appData = await this.db.selectTokenByAppid(appid);
    if (appData && appData.length > 0) {
      const appInfo = appData[0];
      return appInfo.secret;
    }
    throw new CommonException(
      ErrorType.MINI_APP_ERROR,
      `can not find appid :${appid} 对应的 secret`,
      ErrorCode.GET_MINI_TOKEN_ERROR,
    );
  }

  async getTokenByAppId(appid: string): Promise<string> {
    const appData = await this.db.selectTokenByAppid(appid);
    if (appData && appData.length > 0) {
      const appInfo = appData[0];
      const now = Date.now();
      if (appInfo.token && now < appInfo.etime) {
        return appInfo.token;
      } else {
        return this.getTokenFromUrl(appid, appInfo.secret);
      }
    }
    throw new CommonException(
      ErrorType.MINI_APP_ERROR,
      `can not find appid :${appid} 对应的 token`,
      ErrorCode.GET_MINI_TOKEN_ERROR,
    );
  }

  async getTokenFromUrl(appid: string, secret: string): Promise<string> {
    const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`;
    const ret = await getJSON(url);
    if (ret) {
      console.log(ret);
      const { errcode, errmsg, access_token, expires_in } = ret;
      if (errcode) {
        throw new CommonException(
          ErrorType.MINI_APP_ERROR,
          errmsg,
          ErrorCode.GET_MINI_TOKEN_FROMURL_ERROR,
        );
      } else {
        const etime = Date.now() + expires_in * 1000;
        const token = access_token;
        this.db.updateTokenByAppid(appid, token, etime);
      }
    } else {
      throw new CommonException(
        ErrorType.MINI_APP_ERROR,
        `can not getToken from url: ${url}`,
        ErrorCode.GET_MINI_TOKEN_FROMURL_ERROR,
      );
    }
    return ret.access_token;
  }

  async getUserInfo(code: string, appid: string) {
    const openId = await this.getOpenId(code, appid);
    const userInfos = await this.db.selectUserByOpenId(openId);
    if (userInfos && userInfos.length > 0) {
      return userInfos[0];
    } else {
      const id: number = await this.db.saveUser(openId);
      return { id, openid: openId } as IUserInfo;
    }
  }

  async getOpenId(code: string, appid: string): Promise<string> {
    const secret = await this.getSecretByAppId(appid);
    const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`;

    const ret = await getJSON(url);
    if (ret) {
      console.log(ret);
      const { errcode, errmsg, openid } = ret;
      if (errcode) {
        throw new CommonException(
          ErrorType.MINI_APP_ERROR,
          errmsg,
          ErrorCode.GET_MINI_OPENID_FROMURL_ERROR,
        );
      } else {
        return openid;
      }
    } else {
      throw new CommonException(
        ErrorType.MINI_APP_ERROR,
        `can not getToken from url: ${url}`,
        ErrorCode.GET_MINI_OPENID_FROMURL_ERROR,
      );
    }
  }

  async getMccVal(key: string) {
    const mccInfos = await this.db.selectMccInfoByKey(key);
    if (mccInfos && mccInfos.length > 0) {
      return mccInfos[0].value;
    }
    return '';
  }
}
