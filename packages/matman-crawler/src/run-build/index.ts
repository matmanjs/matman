import fs from 'fs';
import path from 'path';
import {MatmanConfig} from 'matman-core';
import rollupBuild from './build';

interface buildOpts {
  isIPC?: boolean;
  matmanConfig: MatmanConfig;
}

/**
 * 构建
 *
 * @param {MatmanConfig} matmanConfig
 * @return {Promise}
 *
 * @author wangjq4214
 */
export default function build(path: string, opts: buildOpts): Promise<string> {
  return new Promise((resolve, reject) => {
    const prependCodePromiseList = [];
    const evalList: string[] = [];

    if (opts.matmanConfig.isDevBuild || false) {
      // 如果是开发模式下
      // 追加开发模式下需要的代码，例如 jQuery
      prependCodePromiseList.push(getDevPrependCode(opts.matmanConfig.crawlerInjectJQuery));
    } else {
      // 如果是非开发模式下
      // 为打包之后的文件手动增加 nightmare client script，以便能与 nightmare 通信
      if (opts.isIPC) {
        prependCodePromiseList.push(getNightmareClientCode());
      }

      // 插入 jQuery
      if (opts.matmanConfig.crawlerInjectJQuery) {
        prependCodePromiseList.push(getJqueryCode('jQueryCode'));
        evalList.push('jQueryCode');
      }
    }

    // 放到最后加入
    prependCodePromiseList.push(rollupBuild(path));

    Promise.all(prependCodePromiseList)
      .then(result => {
        const temp = evalList.map(item => `"${item}"`).join(',');
        result.push(`window.evalList=[${temp}]`);
        // 每段插入的代码之后，注意要加一个换行符号，否则在支持 source map 之后，可能会被其"注释"掉
        resolve(result.join(';\n'));
      })
      .catch(err => {
        reject(err);
      });
  });
}

function getNightmareClientCode(): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, '../../assets/nightmare-preload.js'), 'utf8', (err, data) => {
      if (err) {
        return reject(err);
      }

      resolve(data);
    });
  });
}

function getDevPrependCode(crawlerInjectJQuery: boolean): Promise<string> {
  return new Promise((resolve, reject) => {
    const injectFile = crawlerInjectJQuery ? 'dev-prepend-with-jquery.js' : 'dev-prepend.js';

    fs.readFile(path.join(__dirname, `../../assets/libs/${injectFile}`), 'utf8', (err, data) => {
      if (err) {
        return reject(err);
      }

      resolve(data);
    });
  });
}

function getJqueryCode(key: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, '../../assets/jquery.slim.min.js'), 'utf8', (err, data) => {
      if (err) {
        return reject(err);
      }

      // 必须通过定义变量的方式插入，后续再执行
      resolve(getRawCodeToPrepend(key, data));
    });
  });
}

function getRawCodeToPrepend(key: string, source: string) {
  const rawCode = JSON.stringify(source)
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');

  return `window.${key}=${rawCode};`;
}
