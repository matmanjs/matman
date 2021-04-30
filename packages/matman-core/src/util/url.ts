import { parse as parseUrl } from 'url';

type IQueryResult = { [key: string]: string | string[] };

/**
 * 匹配 url 是否被部分匹配到
 *
 * @param {String} urlToCheck 待匹配的地址
 * @param {String} partialURL 部分地址
 * @param {Object} query 地址中携带的查询参数
 * @return {Boolean}
 */
export function isURLMatch(urlToCheck: string, partialURL: string, query = {}): boolean {
  if (!urlToCheck || !partialURL) {
    return false;
  }

  // ? 之前的部分一定要能够先匹配到
  if (urlToCheck.split('?')[0].indexOf(partialURL.split('?')[0]) < 0) {
    return false;
  }

  const urlToCheckParseQueryResult = parseQuery(parseUrl(urlToCheck).search);
  const partialURLParseQueryResult = parseQuery(parseUrl(partialURL).search);

  // 合并，因为有可能 url 中也携带了 query 参数
  const actualQuery = Object.assign({}, partialURLParseQueryResult, query);

  // 所有的 query key 值列表
  const queryKeyArr = Object.keys(actualQuery);

  // 只要找到存在一个需要查询的参数与目标不一样，则返回不匹配
  for (let i = 0, { length } = queryKeyArr; i < length; i++) {
    const curKey = queryKeyArr[i];

    if (!isEqualOfLoose(urlToCheckParseQueryResult[curKey], actualQuery[curKey])) {
      return false;
    }
  }

  return true;
}

/**
 * 解析 url 中的 query
 *
 * @param {String | null} [url] 请求地址
 * @return IQueryResult
 */
function parseQuery(url: string | undefined | null): IQueryResult {
  if (!url) {
    return {};
  }

  const queryObj: IQueryResult = {};
  const reg = /[?&]([^=&#]+)=([^&#]*)/g;
  const matchArr = url.match(reg);

  if (matchArr?.length) {
    matchArr.forEach((item) => {
      const arr = item.split('=');
      const [keyInUrl, valueInUrl] = arr;

      const key = keyInUrl.substr(1);
      const value = valueInUrl;

      queryObj[key]
        ? (queryObj[key] = ([] as string[]).concat(queryObj[key], value))
        : (queryObj[key] = value);
    });
  }

  return queryObj;
}

/**
 * 判断两个值是否是 ==
 */
function isEqualOfLoose(a: any, b: any): boolean {
  return `${a}` === `${encodeURIComponent(b)}`;
}
