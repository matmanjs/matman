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

export type CookieConfigOpts = cookieStr | CookieMap | CookieObject[];

export default class CookieConfig {
  cookieObjectArr: CookieObject[];

  /**
   * 构造函数
   */
  constructor(cookieConfigOpts: CookieConfigOpts) {
    this.cookieObjectArr = [];

    if (Array.isArray(cookieConfigOpts)) {
      this.cookieObjectArr = this.cookieObjectArr.concat(cookieConfigOpts);
    } else if (cookieConfigOpts && typeof cookieConfigOpts === 'object') {
      Object.keys(cookieConfigOpts).forEach(domainName => {
        this.cookieObjectArr.push({
          name: domainName,
          value: encodeURIComponent(cookieConfigOpts[domainName] + ''),
        });
      });
    } else {
      cookieConfigOpts.split(';').map(item => {
        const res = item.trim().split('=');
        this.cookieObjectArr.push({
          name: res[0],
          value: res[1],
        });
      });
    }
  }

  getCookieObjectArr(pageUrl: string) {
    const url = getUrlFromFullUrl(pageUrl);
    if (!url) {
      return this.cookieObjectArr;
    }

    return this.cookieObjectArr.map(item => {
      if (!item.url && !item.domain) {
        item.url = url;
      }

      return item;
    });
  }

  getCookieStr() {
    return this.cookieObjectArr
      .map(item => {
        return `${item.name}=${item.value}`;
      })
      .join(';');
  }
}

/**
 * 从 url 中获得根地址，以便用于绑定 cookie。
 * 例如传入：https://www.navossoc.com/tests/cookie.php
 * 获得：https://www.navossoc.com
 * @param fullUrl
 */
function getUrlFromFullUrl(fullUrl: string) {
  const reg = new RegExp('(^https?://[^/]*)/?(.*)');
  const matchResult = fullUrl.match(reg);
  return (matchResult && matchResult.length > 1 && matchResult[1]) || '';
}
