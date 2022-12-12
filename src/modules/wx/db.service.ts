/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from '@nestjs/common';
const Mysql = require('node-mysql-promise');

export interface IAppInfo {
  appid: string;
  token?: string;
  etime?: number;
  secret?: string;
}

export interface IUserInfo {
  id?: number;
  openid?: string;
}

@Injectable()
export class DBService {
  mysql: any;
  constructor() {
    this.mysql = Mysql.createConnection({
      host: '182.92.1.128',
      user: 'root',
      password: 'ilovelxh123',
      database: 'words',
    });
  }

  async selectTokenByAppid(appid: string): Promise<IAppInfo[]> {
    return this.mysql
      .table('miniapp_info')
      .field('id, appid, secret, token, etime')
      .where({
        appid,
      })
      .select();
  }

  async updateTokenByAppid(appid: string, token: string, etime: number) {
    return this.mysql
      .table('miniapp_info')
      .where({
        appid,
      })
      .update({
        token,
        etime,
      });
  }

  async selectUserByOpenId(openid: string): Promise<IUserInfo[]> {
    return this.mysql
      .table('user_info')
      .field('id, openid')
      .where({
        openid,
      })
      .select();
  }

  async saveUser(openid: string) {
    return this.mysql
      .table('user_info')
      .add({
        openid,
      })
      .then(insertId => {
        console.log(insertId);
        return insertId;
      })
      .catch(e => {
        console.log(e);
      });
  }

  async selectMccInfoByKey(key: string) {
    return this.mysql
      .table('mcc')
      .field('id,value')
      .where({
        key,
      })
      .select();
  }
}
