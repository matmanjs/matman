import {MATMAN_CONFIG_FILE, findMatmanConfig, Master, PageDriver, MatmanConfig} from 'matman-core';
import PageDriverSync from './PageDriverSync';
import PageDriverAsync from './PageDriver';
import {CreatePageDriverOpts} from '../types';

import {getCallerPath} from '../util/caller';

interface NewPageDriverParams {
  matmanConfig: MatmanConfig;
  newOpts: CreatePageDriverOpts;
}

/**
 * 浏览器驱动类，使用这个类对浏览器进行设置并创建页面实例
 */
class BrowserMaster {
  master: Master;

  constructor(master: Master) {
    this.master = master;
  }

  protected getNewPageParams(
    caseModuleFilePath: string,
    opts: CreatePageDriverOpts = {},
  ): NewPageDriverParams {
    // 自动计算是哪个文件在调用 case 脚本，然后以调用者的文件名来做标记
    // 由于调用者脚本本身已经按目录存储，且同一个目录中不同调用者脚本文件名肯定不一样
    // 这样就能够区分标记了
    if (!opts.tag) {
      const caseCallerPath = getCallerPath(caseModuleFilePath);

      // 注意如果找到的调用文件就是 caseModuleFilePath 本身，则无需设置 tag ，否则就会造成生成的文件名重叠
      if (caseCallerPath && caseCallerPath !== caseModuleFilePath) {
        opts.tag = caseCallerPath;
      }
      // console.log('==caseModuleFilePath==', caseModuleFilePath);
      // console.log('==caseCallerPath==', caseCallerPath);
      // console.log('==opts.tag==', opts.tag);
    }

    // 如果标签就是 case 文件本身路径，则清空，否则就会造成生成的文件名重叠
    if (opts.tag === caseModuleFilePath) {
      opts.tag = '';
    }

    const matmanConfig = findMatmanConfig(caseModuleFilePath, opts);

    if (!matmanConfig) {
      throw new Error(`Could not find ${MATMAN_CONFIG_FILE} or matman config setting!`);
    }

    return {
      matmanConfig,
      newOpts: opts,
    };
  }
}

/**
 * 同步版本的 BrowserMaster
 */
export class BrowserMasterSync extends BrowserMaster {
  /**
   * 创建 PageDriver 对象
   *
   * @param {String} caseModuleFilePath 当前 case 的文件名
   * @param {Object} [opts] 额外参数，传递给 MatmanConfig 和 PageDriver 使用
   * @return {PageDriver}
   * @author helinjiang
   */
  newPageDriver(caseModuleFilePath: string, opts: CreatePageDriverOpts = {}): PageDriver {
    const {matmanConfig, newOpts} = super.getNewPageParams(caseModuleFilePath, opts);

    return new PageDriverSync(this.master, matmanConfig, caseModuleFilePath, newOpts);
  }
}

/**
 * 异步版本的 BrowserMaster
 */
export class BrowserMasterAsync extends BrowserMaster {
  /**
   * 创建 PageDriver 对象
   *
   * @param {String} caseModuleFilePath 当前 case 的文件名
   * @param {Object} [opts] 额外参数，传递给 MatmanConfig 和 PageDriver 使用
   * @return {PageDriver}
   * @author helinjiang
   */
  async newPageDriver(
    caseModuleFilePath: string,
    opts: CreatePageDriverOpts = {},
  ): Promise<PageDriver> {
    const {matmanConfig, newOpts} = super.getNewPageParams(caseModuleFilePath, opts);

    return new PageDriverAsync(this.master, matmanConfig, caseModuleFilePath, newOpts);
  }
}
