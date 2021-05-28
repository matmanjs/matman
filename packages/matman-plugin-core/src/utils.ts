// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import fsHandler from 'fs-handler';

export interface IFSHandlerItem {
  relativePath: string;
  basePath: string;
  isDirectory: () => boolean;
}

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

/**
 * 从某个目录下获取文件
 *
 * @param dir
 * @param all
 * @returns
 */
export function getFileItemFromDir(dir: string, all?: boolean): IFSHandlerItem[] {
  const result: IFSHandlerItem[] = [];

  fsHandler.search.getAll(dir, { globs: [all ? '**' : '*'] }).forEach((item: IFSHandlerItem) => {
    result.push(item);
  });

  return result;
}
