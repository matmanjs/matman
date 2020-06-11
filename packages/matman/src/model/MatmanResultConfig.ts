import path from 'path';
import {getAbsolutePath, MatmanConfig} from 'matman-core';
import {CoverageOrResultOrScreenOpts} from '../types';
import {getFolderNameFromPath, getNewFilePathWithTag, getSaveDirFromPath} from '../util';

export default class MatmanResultConfig {
  tag: string | undefined;
  path: string;

  /**
   * 构造函数
   *
   * @param {MatmanConfig} matmanConfig
   * @param {String | Boolean | Object} opts 是否启用执行结果，或者执行结果保存的文件名路径(如果想对路径，则相对于basePath 而言)，或者执行结果配置
   * @param {String} [opts.path] 执行结果保存的完成文件名，如果不填写，则将根据当前路径自动生成名字
   * @param {Object} [opts.tag] 标记
   * @param {String} [caseModuleFilePath] 测试案例模块的目录
   * @param {String} [tag] 标记
   * @author helinjiang
   */
  constructor(
    matmanConfig: MatmanConfig,
    opts: CoverageOrResultOrScreenOpts,
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
      const relativeSavePath = getSaveDirFromPath(
        path.relative(matmanConfig.caseModulesPath, path.dirname(caseModuleFilePath)),
      );
      const saveFileName = getFolderNameFromPath(path.basename(caseModuleFilePath)) + '.json';
      this.path = this.getMatmanResultFullPath(
        path.join(relativeSavePath, saveFileName),
        matmanConfig.matmanResultPath,
      );
    }
  }

  /**
   * 获得完整的执行结果文件保存路径
   *
   * @param targetPath 原始路径
   * @param basePath 根目录
   * @return {String} 新的路径
   * @author helinjiang
   * @private
   */
  private getMatmanResultFullPath(targetPath: string, basePath: string): string {
    return getNewFilePathWithTag(getAbsolutePath(targetPath, basePath), this.tag);
  }
}
