// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import fsHandler from 'fs-handler';

import path from 'path';

import { IDefinedInstanceBase } from 'matman-core';

interface IFSHandlerItem {
  relativePath: string;
  basePath: string;
  isDirectory: () => boolean;
}

type IDefinedInstance = IDefinedInstanceBase | (() => IDefinedInstanceBase);


/**
 * 加载模块
 *
 * @param {String} moduleId 模块，绝对路径
 * @param {Boolean} [ignoreCache] 是否忽略缓存
 * @return {*}
 */
export function requireModule(moduleId: string, ignoreCache?: boolean): any {
  if (typeof moduleId !== 'string') {
    throw new TypeError('Expected a string');
  }

  const filePath = require.resolve(moduleId);

  // 忽略 require 的缓存
  if (ignoreCache) {
    // Delete itself from module parent
    if (require.cache[filePath]?.parent) {
      let i = require.cache[filePath]?.parent?.children.length;

      // eslint-disable-next-line no-plusplus
      while (i && i--) {
        if (require.cache[filePath]?.parent?.children[i].id === filePath) {
          require.cache[filePath]?.parent?.children.splice(i, 1);
        }
      }
    }

    // Delete module from cache
    delete require.cache[filePath];
  }

  // Return fresh module
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require(filePath);
}

export function getAllDefinedInstances(definedInstanceDir: string): IDefinedInstance[] {
  const result: IDefinedInstance[] = [];

  fsHandler.search.getAll(definedInstanceDir, { globs: ['*'] }).forEach((item: IFSHandlerItem) => {
    const requiredResult = requireModule(path.join(definedInstanceDir, item.relativePath)) as IDefinedInstance;
    result.push(requiredResult);
  });

  return result;
}
