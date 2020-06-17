import {parse as parseUrl} from 'url';

type queryResult = {[key: string]: string | string[]};

/**
 * 匹配 url 是否被部分匹配到
 *
 * @param {String} URLToCheck 待匹配的地址
 * @param {String} partialURL 部分地址
 * @param {Object} query 地址中携带的查询参数
 * @return {Boolean}
 */
export function isURLMatch(URLToCheck: string, partialURL: string, query = {}): boolean {
  if (!URLToCheck || !partialURL) {
    return false;
  }

  // ? 之前的部分一定要能够先匹配到
  if (URLToCheck.split('?')[0].indexOf(partialURL.split('?')[0]) < 0) {
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const URLToCheckParseQueryResult = parseQuery(parseUrl(URLToCheck).search);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const partialURLParseQueryResult = parseQuery(parseUrl(partialURL).search);

  // 合并，因为有可能 url 中也携带了 query 参数
  const actualQuery = Object.assign({}, partialURLParseQueryResult, query);

  // 所有的 query key 值列表
  const queryKeyArr = Object.keys(actualQuery);

  // 只要找到存在一个需要查询的参数与目标不一样，则返回不匹配
  for (let i = 0, length = queryKeyArr.length; i < length; i++) {
    const curKey = queryKeyArr[i];

    if (!isEqualOfLoose(URLToCheckParseQueryResult[curKey], actualQuery[curKey])) {
      return false;
    }
  }

  return true;
}

function parseQuery(url: string | undefined): queryResult {
  if (!url) {
    return {};
  }

  const queryObj: queryResult = {};
  const reg = /[?&]([^=&#]+)=([^&#]*)/g;
  const querys = url.match(reg);

  if (querys) {
    for (const i in querys) {
      const query = querys[i].split('=');
      const key = query[0].substr(1);
      const value = query[1];

      queryObj[key]
        ? (queryObj[key] = ([] as string[]).concat(queryObj[key], value))
        : (queryObj[key] = value);
    }
  }

  return queryObj;
}

function isEqualOfLoose(a: any, b: any) {
  return a == b;
}
