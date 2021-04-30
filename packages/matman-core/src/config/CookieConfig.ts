import _ from 'lodash';

export interface CookieMap {
  [key: string]: string | number;
}

// https://github.com/puppeteer/puppeteer/blob/v4.0.0/docs/api.md#pagesetcookiecookies
export interface CookieObject {
  name: string;
  value: string;
  url?: string;
  domain?: string;
  path?: string;
  expires?: number;
  httpOnly?: boolean;
  secure?: boolean;
}

// mykey1=myvalue1; mykey2=myvalue2
type cookieStr = string;

export type ICookieConfigOpts = cookieStr | CookieMap | CookieObject[];

export default class CookieConfig {
  private readonly cookieObjectArr: CookieObject[];

  /**
   * 构造函数
   */
  public constructor(cookieConfigOpts: ICookieConfigOpts) {
    this.cookieObjectArr = [];

    if (Array.isArray(cookieConfigOpts)) {
      // 如果为数组
      this.cookieObjectArr = this.cookieObjectArr.concat(cookieConfigOpts);
    } else if (cookieConfigOpts && typeof cookieConfigOpts === 'object') {
      // 如果为对象
      Object.keys(cookieConfigOpts).forEach((domainName) => {
        this.cookieObjectArr.push({
          name: domainName,
          value: encodeURIComponent(`${cookieConfigOpts[domainName]}`),
        });
      });
    } else {
      // 如果为字符串
      cookieConfigOpts.split(';').forEach((item) => {
        if (item.indexOf('=') !== -1) {
          const res = item.trim().split('=');
          this.cookieObjectArr.push({
            name: res[0],
            value: res[1],
          });
        }
      });
    }
  }

  public getCookieObjectArr(pageUrl: string) {
    const url = getUrlFromFullUrl(pageUrl);
    if (!url) {
      return this.cookieObjectArr;
    }

    return this.cookieObjectArr.map((item) => {
      const newItem = _.merge({}, item);

      if (!newItem.url && !newItem.domain) {
        newItem.url = url;
      }

      return newItem;
    });
  }

  public getCookieStr() {
    return this.cookieObjectArr.map(item => `${item.name}=${item.value}`).join(';');
  }
}

/**
 * 从 url 中获得根地址，以便用于绑定 cookie。
 * 例如传入：https://www.navossoc.com/tests/cookie.php
 * 获得：https://www.navossoc.com
 *
 * @param {String} fullUrl 完整的url地址
 * @return {String}
 */
function getUrlFromFullUrl(fullUrl: string): string {
  const reg = new RegExp('(^https?://[^/]*)/?(.*)');
  const matchResult = fullUrl.match(reg);
  return (matchResult && (matchResult.length > 1) && matchResult[1]) || '';
}
