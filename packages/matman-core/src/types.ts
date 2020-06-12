/**
 * matman 的配置类型
 *
 * @param {String} rootPath  matman 项目的根目录
 * @param {String} caseModulesPath 测试案例的根目录
 * @param {String} crawlerBuildPath 前端爬虫脚本构建之后的目录
 * @param {RegExp} crawlerMatch 用于匹配是否为前端爬虫脚本的正则表达式
 * @param {Boolean} crawlerInjectJQuery 前端爬虫脚本中是否注入jQuery
 * @param {String} screenshotPath 屏幕截图保存的路径
 * @param {String} coveragePath 覆盖率文件保存的路径
 * @param {String} matmanResultPath MatmanResult 执行结果数据保存的路径
 * @param {Boolean} isDevBuild 是否为开发模式
 * @author helinjiang
 */
export interface MatmanConfigOpts {
  rootPath?: string;
  caseModulesPath?: string;
  crawlerBuildPath?: string;
  crawlerMatch?: RegExp;
  crawlerInjectJQuery?: boolean;
  screenshotPath?: string;
  coveragePath?: string;
  matmanResultPath?: string;
  isDevBuild?: boolean;
  setupOptions?: {name: string; cwd?: string; order: string; auto?: boolean}[];
}
