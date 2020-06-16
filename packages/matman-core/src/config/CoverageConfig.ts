import path from 'path';
import MatmanConfig from './MatmanConfig';
import {getAbsolutePath} from '../util/index';
import {getFolderNameFromPath, getNewFilePathWithTag, getSaveDirFromPath} from '../util/path';

/**
 * 覆盖率选项
 * 是否启用覆盖率, 或者覆盖率保存的文件名路径 (如果想对路径, 则相对于basePath 而言), 或者覆盖率配置
 *
 * @member opts.path 保存覆盖率文件的路径, 如果没有填写就自动生成
 * @member opts.tag 标记
 */
export type CoverageOpts = string | boolean | {tag?: string; path: string};

class CoverageConfig {
  path: string;
  tag: string | undefined;

  /**
   * 构造函数
   *
   * @param matmanConfig
   * @param opts
   * @param caseModuleFilePath 测试案例模块的目录
   * @param tag 标记
   *
   * @author helinjiang
   * @author wangjq4214
   */
  constructor(
    matmanConfig: MatmanConfig,
    opts: CoverageOpts,
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
      this.path = this.getCoverageFullPath(opts.path, matmanConfig.coveragePath);
    } else if (typeof opts === 'string') {
      // 如果 opts 为字符串，则代表设置的是覆盖率文件保存路径
      this.path = this.getCoverageFullPath(opts, matmanConfig.coveragePath);
    } else {
      // 其他情况自动生成覆盖率文件保存路径
      const relativeSavePath = getSaveDirFromPath(
        path.relative(matmanConfig.caseModulesPath, caseModuleFilePath),
      );

      const saveFileName = getFolderNameFromPath(path.basename(caseModuleFilePath)) + '.json';

      this.path = this.getCoverageFullPath(
        path.join(relativeSavePath, saveFileName),
        matmanConfig.coveragePath,
      );
    }
  }

  /**
   * 根据一个标志获得新的路径
   *
   * @param {String | Number} id 标志
   * @return {string} 新的路径
   * @author helinjiang
   */
  getPathWithId(id: string | number): string {
    return this.path.replace(/(.*)\.(.*)/, function (match, p1, p2) {
      return [p1, `${id}.${p2}`].join('_');
    });
  }

  /**
   * 获得完整的覆盖率文件保存路径
   *
   * @param targetPath 原始路径
   * @param basePath 根目录
   * @return {String} 新的路径
   * @author helinjiang
   * @private
   */
  private getCoverageFullPath(targetPath: string, basePath: string): string {
    return getNewFilePathWithTag(getAbsolutePath(targetPath, basePath), this.tag);
  }
}

export default CoverageConfig;
