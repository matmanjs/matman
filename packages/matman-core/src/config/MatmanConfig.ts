import fs from 'fs';
import path from 'path';

import { getAbsolutePath } from '../util';
import { IMatmanConfigOpts, ISetupOptions } from '../types';

export default class MatmanConfig {
  public matmanRootPath: string;
  public caseModulesPath: string;
  public crawlerBuildPath: string;
  public crawlerInjectJQuery: boolean;
  public screenshotPath: string;
  public coveragePath: string;
  public matmanResultPath: string;
  public isDevBuild: boolean;
  public setupOptions: ISetupOptions[];

  public constructor(matmanRootPath: string, opts: IMatmanConfigOpts = {}) {
    // 消除警告, 其实会被覆盖
    this.isDevBuild = false;

    // 项目根目录
    // 根目录是必须的，因为会有一些默认值都是基于这个根目录而言
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
    this.setupOptions = opts.setupOptions || [];
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
}
