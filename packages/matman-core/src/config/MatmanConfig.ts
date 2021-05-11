import fs from 'fs';
import path from 'path';

import { getAbsolutePath } from '../util';
import { IMatmanConfigOpts } from '../types';
import { IPluginBase } from '../typings/PluginBase';

export default class MatmanConfig {
  // 用于同源测试的项目源码的根目录，一般指 package.json 的目录
  public workspacePath?: string;

  // 测试产物的输出目录
  public outputPath?: string;

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
    this.matmanRootPath = getAbsolutePath(matmanRootPath);

    if (!fs.existsSync(this.matmanRootPath)) {
      throw new Error(`Unknown matmanRootPath=${this.matmanRootPath}`);
    }

    // 测试案例的根目录
    this.caseModulesPath = getAbsolutePath(
      opts.caseModulesPath || './src/case_modules',
      this.matmanRootPath,
    );

    // 如果默认的 caseModulesPath 不存在，则复用 matmanRootPath
    if (!fs.existsSync(this.caseModulesPath)) {
      this.caseModulesPath = this.matmanRootPath;
    }

    // crawler script 构建之后的目录
    this.crawlerBuildPath = getAbsolutePath(
      opts.crawlerBuildPath || './build/crawler-script',
      this.matmanRootPath,
    );

    // 前端爬虫脚本中是否注入jQuery，默认值为 true
    this.crawlerInjectJQuery = !!opts.crawlerInjectJQuery;

    // 屏幕截图保存的路径
    this.screenshotPath = getAbsolutePath(
      opts.screenshotPath || './build/screenshot_output',
      this.matmanRootPath,
    );

    // 覆盖率文件保存的路径
    this.coveragePath = getAbsolutePath(
      opts.coveragePath || './build/coverage_output',
      this.matmanRootPath,
    );

    // MatmanResult 执行结果数据保存的路径
    this.matmanResultPath = getAbsolutePath(
      opts.matmanResultPath || './build/matman_result_output',
      this.matmanRootPath,
    );

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

  public getPlugin(pluginName: string): IPluginBase|null{
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
}
