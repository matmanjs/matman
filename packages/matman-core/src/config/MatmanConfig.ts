import fs from 'fs';
import path from 'path';

import { getAbsolutePath, searchFilePath } from '../util';
import { IPluginBase } from '../typings/plugin';

/**
 * matman 的配置类型
 * 同时为配置文件的结构, 当前对配置文件的解析只限制为 JS
 *
 * @member workspacePath  用于同源测试的项目源码的根目录，一般指 package.json 的目录
 * @member outputPath  测试产物的输出目录
 * @member matmanRootPath  matman 项目的根目录
 * @member caseModulesPath 测试案例的根目录
 * @member crawlerBuildPath 前端爬虫脚本构建之后的目录
 * @member crawlerInjectJQuery 前端爬虫脚本中是否注入jQuery
 * @member screenshotPath 屏幕截图保存的路径
 * @member coveragePath 覆盖率文件保存的路径
 * @member matmanResultPath MatmanResult 执行结果数据保存的路径
 * @member isDevBuild 是否为开发模式
 * @member plugins 插件列表
 */
export interface IMatmanConfigOpts {
  workspacePath?: string;
  outputPath?: string;
  matmanRootPath?: string;
  caseModulesPath?: string;
  crawlerBuildPath?: string;
  crawlerInjectJQuery?: boolean;
  screenshotPath?: string;
  coveragePath?: string;
  matmanResultPath?: string;
  isDevBuild?: boolean;
  plugins?: IPluginBase[];
}

export default class MatmanConfig {
  // 用于同源测试的项目源码的根目录，一般指 package.json 的目录
  public workspacePath: string;

  // 测试产物的输出目录
  public outputPath: string;

  // matman 项目的根目录
  public matmanRootPath: string;

  // 测试案例的根目录
  public caseModulesPath: string;

  // 前端爬虫脚本构建之后的目录
  public crawlerBuildPath: string;

  // 前端爬虫脚本中是否注入jQuery
  public crawlerInjectJQuery: boolean;

  // 屏幕截图保存的路径
  public screenshotPath: string;

  // 覆盖率文件保存的路径
  public coveragePath: string;

  // MatmanResult 执行结果数据保存的路径
  public matmanResultPath: string;

  // 是否为开发模式
  public isDevBuild: boolean;

  // 插件列表
  public plugins: IPluginBase[];

  public constructor(matmanRootPath: string, opts: IMatmanConfigOpts = {}) {
    // 消除警告, 其实会被覆盖
    this.isDevBuild = false;

    // matman 项目的根目录
    // 它在内部处理时是必须的，因为会有一些默认值都是基于这个根目录而言
    // 获取值的优先级为：参数指定 > matman.config.js 路径 > package.json 路径
    this.matmanRootPath = this.getFullPath('', matmanRootPath, true);

    // 用于同源测试的项目源码的根目录，一般指 package.json 的目录
    this.workspacePath = this.getFullPath(
      searchFilePath(this.matmanRootPath, 'package.json'),
      opts.workspacePath,
      true,
    );

    // 测试产物的输出目录
    this.outputPath = this.getFullPath(
      path.join(this.workspacePath, '.matman_output'),
      opts.outputPath,
    );

    // 测试案例的根目录
    this.caseModulesPath = this.getFullPath('./src/case_modules', opts.caseModulesPath, true);

    // crawler script 构建之后的目录
    this.crawlerBuildPath = this.getFullPath('./build/crawler-script', opts.crawlerBuildPath);

    // 前端爬虫脚本中是否注入jQuery，默认值为 true
    this.crawlerInjectJQuery = !!opts.crawlerInjectJQuery;

    // 屏幕截图保存的路径
    this.screenshotPath = this.getFullPath('./build/screenshot_output', opts.screenshotPath);

    // 覆盖率文件保存的路径
    this.coveragePath = this.getFullPath('./build/coverage_output', opts.coveragePath);

    // MatmanResult 执行结果数据保存的路径
    this.matmanResultPath = this.getFullPath('./build/matman_result_output', opts.matmanResultPath);

    // 设置 dev 开发模式
    this.setIsDevBuild(!!opts.isDevBuild);

    // 设置启动脚本
    this.plugins = opts.plugins || [];
  }

  /**
   * 设置当前是不是开发场景的构建模式
   *
   * @param {Boolean} isDevBuild
   */
  public setIsDevBuild(isDevBuild: boolean): void {
    // 是否为开发模式
    this.isDevBuild = isDevBuild;

    // 如果是开发模式下，则修改构建之后的路径，使之与原构建路径同目录，且文件夹增加 _dev 后缀
    if (this.isDevBuild) {
      this.crawlerBuildPath = path.join(
        path.dirname(this.crawlerBuildPath),
        `${path.basename(this.crawlerBuildPath)}_dev`,
      );
    }
  }

  public getPlugin(pluginName: string): IPluginBase | null {
    if (!this.plugins || !this.plugins.length) {
      return null;
    }

    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let index = 0; index < this.plugins.length; index++) {
      const element = this.plugins[index] as IPluginBase;

      if (element.name === pluginName) {
        return element;
      }
    }

    return null;
  }

  private getFullPath(
    defaultValue: string,
    pathFromParam?: string,
    shouldCheckExists?: boolean,
  ): string {
    const pathResult = getAbsolutePath(pathFromParam || defaultValue, this.matmanRootPath);

    if (shouldCheckExists && !fs.existsSync(pathResult)) {
      throw new Error(
        `Unknown path=${pathResult}, pathFromParam=${pathFromParam}, defaultValue=${defaultValue}`,
      );
    }

    return pathResult;
  }
}
