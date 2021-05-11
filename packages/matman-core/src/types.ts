import { IPluginBase } from './typings/PluginBase';

/**
 * 供 IDE 使用的启动项目的配置
 *
 * @member name 启动项目的名称
 * @member cwd 运行命令的文件夹
 * @member order 需要运行的命令
 * @member auto 是否在初始化时自动运行
 */
export interface ISetupOptions {
  name: string;
  cwd?: string;
  order: string;
  auto?: boolean;
}

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
