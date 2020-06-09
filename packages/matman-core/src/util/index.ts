import fs from 'fs';
import path from 'path';
import {MatmanConfigOpts} from '../types';
import MatmanConfig from '../MatmanConfig';

import {MATMAN_CONFIG_FILE as configFileName} from '../config';

/**
 * 获得绝对路径地址
 *
 * @param {String} targetPath 目标路径
 * @param {String} [basePath] 根路径，如果目标路径为相对路径，则将用该路径作为其根路径
 * @return {String}
 */
export function getAbsolutePath(targetPath?: string, basePath?: string): string {
  if (!targetPath) {
    return '';
  }

  if (path.isAbsolute(targetPath)) {
    return targetPath;
  }

  return basePath ? path.resolve(basePath, targetPath) : path.resolve(targetPath);
}

/**
 * 从指定目录开始向上查找 config 配置文件。
 *
 * @param {String} configPath 起始路径，如果非法路径，则默认从当前文件的路径向上查找
 * @return {String}
 */
export function getConfigFilePath(configPath: string): string {
  // 非法的路径时，默认为本文件夹的 dirname
  if (!configPath || !fs.existsSync(configPath)) {
    // console.log('Unknow configPath=' + configPath);
    configPath = __dirname;
  }

  // 如果不是 config file，则从当前路径往上找 config file
  if (configPath.indexOf(configFileName) < 0) {
    const result = _search(configPath);

    // 如果没有找到，则直接返回空路径即可
    if (!result) {
      return '';
    }

    configPath = path.resolve(result, configFileName);
  }

  return configPath;
}

/**
 * 通过某个路径一直往上找，直到找到 matman.config.js 文件为止，并返回 matmanConfig 对象
 *
 * @param {String} basePath 起始路径
 * @param {Object} [matmanConfigOpts] 额外传递给 MatmanConfig 的参数，可覆盖 matman.config.js 中配置内容
 * @return {null | MatmanConfig}
 */
export async function findMatmanConfig(
  basePath: string,
  matmanConfigOpts?: MatmanConfigOpts,
): Promise<null | MatmanConfig> {
  let configData: MatmanConfigOpts;

  if (matmanConfigOpts && matmanConfigOpts.rootPath && fs.existsSync(matmanConfigOpts.rootPath)) {
    // 如果已经传递了 rootPath，且为合法的路径，则直接使用
    // 此时无需去寻找 matman.config.js 文件
    configData = Object.assign({}, matmanConfigOpts);
  } else {
    // 获得 matman.config.js 的文件路径
    const configFilePath = getConfigFilePath(basePath);

    // 如果不是 config file，则从当前路径往上找 config file
    if (!configFilePath) {
      console.error('Can not find config file from basePath=' + basePath);
      return null;
    }

    // 获取 matman.config.js 中的配置项
    const res = await import(configFilePath);
    configData = Object.assign({}, res.default, matmanConfigOpts);
  }

  try {
    // 根据配置内容获得 matmanConfig 的对象
    if (!configData.rootPath) {
      throw new Error('rootPath must be defined');
    }

    return new MatmanConfig(configData.rootPath, configData);
  } catch (err) {
    console.error((err && err.message) || err);
    return null;
  }
}

/**
 * 在指定的路径中，获得配置文件的路径。
 *
 * 寻找的规则：从指定的路径开始，依次往上级目录查找，一直到根目录为止，如果找到，则停止。
 *
 * @param {String} [targetPath] 目标路径
 * @return {String}
 */
function _search(targetPath: string): string {
  let currDir = targetPath || process.cwd();
  let isExist = true;

  while (!fs.existsSync(path.join(currDir, configFileName))) {
    currDir = path.join(currDir, '../');

    // unix跟目录为/， win32系统根目录为 C:\\格式的
    if (currDir === '/' || /^[a-zA-Z]:\\$/.test(currDir)) {
      isExist = false;
      // console.log('未找到 ' + configFileName);
      break;
    }
  }

  return isExist ? currDir : '';
}
