import Nightmare from 'nightmare';

/**
 * 供 IDE 使用的启动项目的配置
 *
 * @member name 启动项目的名称
 * @member cwd 运行命令的文件夹
 * @member order 需要运行的命令
 * @member auto 是否在初始化时自动运行
 *
 * @author wangjq4214
 */
export interface SetupOptions {
  name: string;
  cwd?: string;
  order: string;
  auto?: boolean;
}

/**
 * matman 的配置类型
 * 同时为配置文件的结构, 当前对配置文件的解析只限制为 JS
 *
 * @member rootPath  matman 项目的根目录
 * @member caseModulesPath 测试案例的根目录
 * @member crawlerBuildPath 前端爬虫脚本构建之后的目录
 * @member crawlerInjectJQuery 前端爬虫脚本中是否注入jQuery
 * @member screenshotPath 屏幕截图保存的路径
 * @member coveragePath 覆盖率文件保存的路径
 * @member matmanResultPath MatmanResult 执行结果数据保存的路径
 * @member isDevBuild 是否为开发模式
 * @member setupOptions 提供 IDE 的启动命令
 *
 * @author helinjiang
 * @author wangjq4214
 */
export interface MatmanConfigOpts {
  rootPath?: string;
  caseModulesPath?: string;
  crawlerBuildPath?: string;
  crawlerInjectJQuery?: boolean;
  screenshotPath?: string;
  coveragePath?: string;
  matmanResultPath?: string;
  isDevBuild?: boolean;
  setupOptions?: SetupOptions[];
}

/**
 * 对 nightmare 的接口进行拓展
 */
export interface NightmareOpts extends Nightmare.IConstructorOptions {
  doNotCloseBrowser?: boolean;
  switches?: {
    'proxy-server': string;
    // 必须设置一下这个，否则在某些情况下 https 地址无法使用
    // https://github.com/matmanjs/matman/issues/159
    'ignore-certificate-errors': boolean;
  };
  webPreferences?: {
    // 用例过多且频繁启动测试时可能会存在失败的场景 #154
    partition: string;
    preload: null | (() => any) | string;
  };
}
