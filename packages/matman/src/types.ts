/**
 * matman 的配置类型
 *
 * @param {String} rootPath  matman 项目的根目录
 * @param {String} caseModulesPath 测试案例的根目录
 * @param {String} crawlerBuildPath 前端爬虫脚本构建之后的目录
 * @param {Boolean} crawlerInjectJQuery 前端爬虫脚本中是否注入jQuery
 * @param {String} screenshotPath 屏幕截图保存的路径
 * @param {String} coveragePath 覆盖率文件保存的路径
 * @param {String} matmanResultPath MatmanResult 执行结果数据保存的路径
 * @param {Boolean} isDevBuild 是否为开发模式
 */
export interface IMatmanConfigOpts {
  rootPath?: string;
  caseModulesPath?: string;
  crawlerBuildPath?: string;
  crawlerInjectJQuery?: boolean;
  screenshotPath?: string;
  coveragePath?: string;
  matmanResultPath?: string;
  isDevBuild?: boolean;
}

// export type CreatePageDriverOpts = PageDriverOpts & MatmanConfigType;
