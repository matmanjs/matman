import path from 'path';
import fse from 'fs-extra';

import MatmanConfig from './MatmanConfig';
import { IMatmanResult } from '../typings/matman-result';
import { getAbsolutePath } from '../util';
import { getFolderNameFromPath, getNewFilePathWithTag, getSaveDirFromPath } from '../util/path';

/**
 * 执行结果选项
 * 是否启用执行结果，或者执行结果保存的文件名路径(如果想对路径，则相对于basePath 而言)，或者执行结果配置
 */
export type IResultOpts = string | boolean | { tag?: string; path: string };

export default class MatmanResultConfig {
  public tag: string | undefined;
  public path: string;

  public constructor(
    matmanConfig: MatmanConfig,
    opts: IResultOpts,
    caseModuleFilePath: string,
    tag?: string,
  ) {
    this.tag = tag;

    if (opts && typeof opts === 'object') {
      // 对象中传递的标记优先
      if (opts.tag) {
        this.tag = opts.tag;
      }

      // 如果传递了对象
      this.path = this.getMatmanResultFullPath(opts.path, matmanConfig.matmanResultPath);
    } else if (typeof opts === 'string') {
      // 如果 opts 为字符串，则代表设置的是执行结果文件保存路径
      this.path = this.getMatmanResultFullPath(opts, matmanConfig.matmanResultPath);
    } else {
      // 其他情况自动生成执行结果文件保存路径
      const r = path.relative(matmanConfig.caseModulesPath, path.dirname(caseModuleFilePath));
      const relativeSavePath = getSaveDirFromPath(r);

      // 文件保存的名字
      const saveFileName = `${getFolderNameFromPath(path.basename(caseModuleFilePath))}.json`;

      this.path = this.getMatmanResultFullPath(
        path.join(relativeSavePath, saveFileName),
        matmanConfig.matmanResultPath,
      );
    }
  }

  /**
   * 保存结果到本地
   *
   * @param {IMatmanResult} matmanResult
   */
  public save(matmanResult: IMatmanResult): void {
    fse.outputJsonSync(this.path, JSON.parse(matmanResult.toString()));
  }

  /**
   * 获得完整的执行结果文件保存路径
   *
   * @private
   * @param {String} targetPath 原始路径
   * @param {String} basePath 根目录
   * @return {String}
   */
  private getMatmanResultFullPath(targetPath: string, basePath: string): string {
    return getNewFilePathWithTag(getAbsolutePath(targetPath, basePath), this.tag);
  }
}
