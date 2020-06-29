import path from 'path';
import fse from 'fs-extra';
import _ from 'lodash';
import MatmanConfig from './MatmanConfig';
import MatmanResult from '../model/MatmanResult';
import {getAbsolutePath} from '../util/index';
import {getFolderNameFromPath, getNewFilePathWithTag, getSaveDirFromPath} from '../util/path';

/**
 * 执行结果选项
 * 是否启用执行结果，或者执行结果保存的文件名路径(如果想对路径，则相对于basePath 而言)，或者执行结果配置
 *
 * @member opts.path 执行结果保存的完成文件名，如果不填写，则将根据当前路径自动生成名字
 * @member opts.tag 标记
 */
export type ResultOpts = string | boolean | {tag?: string; path: string};

class MatmanResultConfig {
  tag: string | undefined;
  path: string;

  /**
   * 构造函数
   *
   * @param matmanConfig
   * @param opts
   * @param caseModuleFilePath 测试案例模块的目录
   * @param tag 标记
   *
   * @author helinjiang
   */
  constructor(
    matmanConfig: MatmanConfig,
    opts: ResultOpts,
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

  save(matmanResult: MatmanResult) {
    const saveData = _.cloneDeep(matmanResult);

    // 移除 queueHandler ，因为会与 globalInfo 中的数据重复
    delete saveData.queueHandler;

    fse.outputJsonSync(this.path, saveData);
  }

  /**
   * 获得完整的执行结果文件保存路径
   *
   * @private
   * @param targetPath 原始路径
   * @param basePath 根目录
   *
   * @author helinjiang
   */
  private getMatmanResultFullPath(targetPath: string, basePath: string): string {
    return getNewFilePathWithTag(getAbsolutePath(targetPath, basePath), this.tag);
  }
}

export default MatmanResultConfig;
