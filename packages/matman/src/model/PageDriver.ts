// import path from 'path';
// import fs from 'fs-extra';
// import puppeteer from 'puppeteer';
// import Nightmare from 'nightmare';
// import {
//   MatmanConfig,
//   PageDriver as IPageDriver,
//   DeviceConfig,
//   ScreenshotConfig,
//   CoverageConfig,
//   MatmanResultConfig,
//   DeviceConfigOpts,
//   ScreenOpts,
//   CoverageOpts,
//   ResultOpts,
//   Runner,
// } from 'matman-core';
//
// import MatmanResult from './MatmanResult';
// import {PageDriverOpts} from '../types';
//
// /**
//  * 页面操作类，使用这个类可以实现对浏览器页面的控制
//  */
// export default class PageDriver implements IPageDriver {
//   // 配置项目
//   matmanConfig: MatmanConfig;
//   caseModuleFilePath: string;
//   useRecorder: boolean;
//   tag: string | undefined;
//   delayBeforeRun: number;
//   proxyServer: string;
//   mockstarQuery: null | {appendToUrl: (s: string) => string};
//   cookies: string | {[key: string]: any};
//   deviceConfig: null | DeviceConfig;
//   screenshotConfig: null | ScreenshotConfig;
//   coverageConfig: null | CoverageConfig;
//   matmanResultConfig: null | MatmanResultConfig;
//
//   // 页面信息
//   pageUrl: string;
//   waitFn: number | string | ((...args: any[]) => number | string);
//   waitFnArgs: any[];
//   evaluateFn: null | (() => any) | string;
//   evaluateFnArgs: any[];
//   actionList: (((n: Nightmare) => Nightmare) | ((p: puppeteer.Page) => Promise<void>))[];
//   _dataIndexMap: {[key: string]: number};
//   _isDefaultScanMode: boolean;
//   _isInIDE: boolean;
//
//   // master
//   private master: Runner;
//
//   /**
//    * 构造函数
//    *
//    * @param {MatmanConfig} matmanConfig
//    * @param {String} caseModuleFilePath  测试case文件的路径
//    * @param {Object} [opts] 参数
//    * @param {Object} [opts.delayBeforeRun] 延时多少ms再启动
//    * @param {String} [opts.tag] 标记，在某些场景下使用，例如截图保存文件中追加该标记，用于做区分
//    * @param {Boolean} [opts.useRecorder] 是否使用记录器
//    * @param {Boolean} [opts.doNotCloseBrowser] 是否在执行完成之后不要关闭浏览器，默认为 false
//    * @param {Boolean} [opts.nightmareConfig] 传递给 nightmare 的配置
//    * @author helinjiang
//    */
//   constructor(
//     master: Runner,
//     matmanConfig: MatmanConfig,
//     caseModuleFilePath: string,
//     opts: PageDriverOpts = {},
//   ) {
//     this.master = master;
//
//     this.matmanConfig = matmanConfig;
//
//     // 测试case文件的路径
//     // TODO 需要确保存在
//     this.caseModuleFilePath = caseModuleFilePath;
//
//     this.useRecorder = !!opts.useRecorder;
//
//     this.tag = opts.tag;
//
//     // 特殊处理：如果 this.tag 是存在的文件，则获取文件名
//     if (this.tag && fs.existsSync(this.tag)) {
//       this.tag = path.basename(this.tag).replace(/\./gi, '_');
//     }
//
//     // 延时多少ms再启动
//     this.delayBeforeRun = typeof opts.delayBeforeRun === 'number' ? opts.delayBeforeRun : 0;
//
//     this.proxyServer = '';
//     this.mockstarQuery = null;
//
//     this.cookies = '';
//     this.deviceConfig = null;
//     this.screenshotConfig = null;
//     this.coverageConfig = null;
//     this.matmanResultConfig = null;
//
//     this.pageUrl = '';
//
//     this.waitFn = 500;
//     this.waitFnArgs = [];
//
//     this.evaluateFn = null;
//     this.evaluateFnArgs = [];
//
//     this.actionList = [];
//
//     this._dataIndexMap = {};
//     this._isDefaultScanMode = false;
//     this._isInIDE = !!opts.isInIDE;
//   }
//
//   /**
//    * 走指定的代理服务，由代理服务配置请求加载本地项目，从而达到同源测试的目的
//    * 若不配置，则之前请求现网，亦可直接测试现网的服务
//    *
//    * https://github.com/segmentio/nightmare#switches
//    *
//    * @param {String} proxyServer 代理服务器，格式为 my_proxy_server.example.com:8080，例如 127.0.0.1:8899
//    * @return {PageDriver}
//    * @author helinjiang
//    */
//   async useProxyServer(proxyServer: string): Promise<void> {
//     this.proxyServer = proxyServer;
//
//     await Promise.resolve();
//   }
//
//   /**
//    * TODO 支持动态设置本次请求动态设置规则，
//    * 这样可以支持自定义的代理mock数据等场景
//    *
//    * @param getRulesCall
//    * @param opts
//    * @return {PageDriver}
//    * @author helinjiang
//    */
//   async useWhistle(getRulesCall: () => void, opts = {}): Promise<void> {
//     // .useWhistle((data) => {
//     //     return {
//     //         name: `[auto]matman_demo_03_${data.port}`,
//     //         rules: [
//     //             `www.baidu.com ${path.join(__dirname, '../../../local-project')}/baidu.html`
//     //         ]
//     //     };
//     // }, { autoStartWhistle: true })
//     await Promise.resolve();
//   }
//
//   /**
//    * 使用 mockstar 工具来做接口 mock 数据
//    *
//    * https://github.com/mockstarjs/mockstar
//    *
//    * @param {MockStarQuery} mockstarQuery 详见 matman 组件的定义
//    * @return {PageDriver}
//    * @author helinjiang
//    */
//   async useMockstar(mockstarQuery: {appendToUrl: (s: string) => string}): Promise<void> {
//     if (!mockstarQuery || typeof mockstarQuery.appendToUrl !== 'function') {
//       throw new Error(
//         '请传递正确的 MockStarQuery 对象，请参考： https://www.npmjs.com/package/mockstar',
//       );
//     }
//
//     this.mockstarQuery = mockstarQuery;
//
//     await Promise.resolve();
//   }
//
//   /**
//    * 注入 cookie
//    *
//    * https://github.com/helinjiang/nightmare-handler/blob/master/docs/exCookies.md
//    * https://github.com/helinjiang/nightmare-handler/tree/master/demo/extend-exCookies
//    *
//    * @param {String | Object } cookies 支持 `mykey1=myvalue1; mykey2=myvalue2` 和 `{mykey1:'myvalue1', mykey2:'myvalue'}` 写法
//    * @return {PageDriver}
//    * @author helinjiang
//    */
//   async setCookies(cookies: string | {[key: string]: any}): Promise<void> {
//     this.cookies = cookies;
//     await Promise.resolve();
//   }
//
//   /**
//    * 设置无头浏览器设备参数
//    *
//    * https://github.com/helinjiang/nightmare-handler/blob/master/docs/exDevice.md
//    *
//    * @param {String | Object} deviceConfig 设备名或者设备配置，默认值为 mobile
//    * @param {String} [deviceConfig.name] 设备名字
//    * @param {String} [deviceConfig.UA] userAgent
//    * @param {Number} [deviceConfig.width] 视窗宽度
//    * @param {Number} [deviceConfig.height] 视窗高度，注意这里不是指页面的高度，页面高度要小于这个值
//    * @return {PageDriver}
//    * @author helinjiang
//    */
//   async setDeviceConfig(deviceConfig: DeviceConfigOpts): Promise<void> {
//     this.deviceConfig = new DeviceConfig(deviceConfig || 'mobile');
//     await Promise.resolve();
//   }
//
//   /**
//    * 设置截屏参数，默认不截图
//    *
//    * @param {Boolean | String | Object} screenshotConfig
//    * @return {PageDriver}
//    * @author helinjiang
//    */
//   async setScreenshotConfig(screenshotConfig: ScreenOpts): Promise<void> {
//     if (screenshotConfig) {
//       this.screenshotConfig = new ScreenshotConfig(
//         this.matmanConfig,
//         screenshotConfig,
//         this.caseModuleFilePath,
//         this.tag,
//       );
//     }
//     await Promise.resolve();
//   }
//
//   /**
//    * 设置覆盖率参数
//    *
//    * @param {Boolean | String | Object} coverageConfig
//    * @return {PageDriver}
//    * @author helinjiang
//    */
//   async setCoverageConfig(coverageConfig: CoverageOpts): Promise<void> {
//     if (coverageConfig) {
//       this.coverageConfig = new CoverageConfig(
//         this.matmanConfig,
//         coverageConfig,
//         this.caseModuleFilePath,
//         this.tag,
//       );
//     }
//
//     await Promise.resolve();
//   }
//
//   /**
//    * 设置 MatmanResult 执行结果参数
//    *
//    * @param {Boolean | String | Object} matmanResultConfig
//    * @return {PageDriver}
//    * @author helinjiang
//    */
//   async setMatmanResultConfig(matmanResultConfig: ResultOpts): Promise<void> {
//     if (matmanResultConfig) {
//       this.matmanResultConfig = new MatmanResultConfig(
//         this.matmanConfig,
//         matmanResultConfig,
//         this.caseModuleFilePath,
//         this.tag,
//       );
//     }
//
//     await Promise.resolve();
//   }
//
//   /**
//    * 加载指定的页面地址
//    *
//    * @param pageUrl
//    * @return {PageDriver}
//    * @author helinjiang
//    */
//   async goto(pageUrl: string): Promise<void> {
//     this.pageUrl = pageUrl;
//     await Promise.resolve();
//   }
//
//   /**
//    * 增加测试动作
//    *
//    * @param {String} actionName 动作名称，后续可通过它来获得最后的数据
//    * @param {Function} actionCall 执行函数，接受一个 nightmare 对象，可以直接操作
//    * @return {PageDriver}
//    * @author helinjiang
//    */
//   async addAction(
//     actionName: string,
//     actionCall: ((n: Nightmare) => Nightmare) | ((p: puppeteer.Page) => Promise<void>),
//   ): Promise<void> {
//     if (typeof actionCall === 'function') {
//       this.actionList.push(actionCall);
//       this._dataIndexMap[actionName + ''] = this.actionList.length - 1;
//     } else if (typeof actionName === 'function') {
//       this.actionList.push(actionName);
//     } else {
//       throw new Error('addAction should assign function!');
//     }
//
//     await Promise.resolve();
//   }
//
//   /**
//    * 需要等待某些条件达成，才开始运行爬虫脚本，与 nightmare 的 wait 含义和用法一致
//    *
//    * https://www.npmjs.com/package/nightmare#waitms
//    * https://www.npmjs.com/package/nightmare#waitselector
//    * https://www.npmjs.com/package/nightmare#waitfn-arg1-arg2
//    *
//    * @param {String | Function} fn
//    * @param [args]
//    * @return {PageDriver}
//    * @author helinjiang
//    */
//   async wait(fn: number | string): Promise<void>;
//   async wait(fn: (...args: any[]) => number | string, ...args: any[]): Promise<void>;
//   async wait(
//     fn: number | string | ((...args: any[]) => number | string),
//     ...args: any[]
//   ): Promise<void> {
//     this.waitFn = fn;
//     this.waitFnArgs = args;
//
//     await Promise.resolve();
//   }
//
//   /**
//    * 执行爬虫脚本或者方法
//    *
//    * https://www.npmjs.com/package/nightmare#evaluatefn-arg1-arg2
//    *
//    * @param {String | Function} fn
//    * @param [args]
//    * @return {PageDriver}
//    * @author helinjiang
//    */
//   async evaluate(fn: string): Promise<void>;
//   async evaluate(fn: () => any, ...args: any[]): Promise<void>;
//   async evaluate(fn: string | (() => any), ...args: any[]): Promise<void> {
//     this.evaluateFn = fn;
//     this.evaluateFnArgs = args;
//
//     await Promise.resolve();
//   }
//
//   /**
//    * 执行自定义的方法，适用于 debug 和自定义扩展等场景
//    *
//    * @param {Function} customFn 自定义函数，会传递 PageDriver 给它
//    * @return {PageDriver}
//    * @author helinjiang
//    */
//   async executeCustomFn(customFn: (p: PageDriver) => void): Promise<void> {
//     if (typeof customFn === 'function') {
//       customFn(this);
//     }
//     await Promise.resolve();
//   }
//
//   /**
//    * 结束，获取结果
//    * @return {Promise<{}>}
//    * @author helinjiang
//    */
//   end(): Promise<MatmanResult | PageDriver> {
//     // 默认处理 coverage，根据 window.__coverage__
//     if (!this.coverageConfig) {
//       this.setCoverageConfig(true);
//     }
//
//     // 默认处理 matmanResult
//     if (!this.matmanResultConfig) {
//       this.setMatmanResultConfig(true);
//     }
//
//     // 兼容没有定义 run 方法的场景
//     if (!this.actionList.length) {
//       this._isDefaultScanMode = true;
//       if (this.master?.name === 'puppeteer') {
//         this.addAction('_scan_page_', async function (n: puppeteer.Page) {
//           await n.waitFor(500);
//         });
//       } else {
//         this.addAction('_scan_page_', function (n: Nightmare) {
//           return n.wait(500);
//         });
//       }
//     }
//
//     if (this._isInIDE) {
//       return new Promise(resolve => {
//         resolve(this);
//       });
//     }
//
//     this.master?.setPage(this);
//
//     return this.master
//       ?.getResult()
//       .then(resultData => {
//         return new MatmanResult(resultData);
//       })
//       .then(matmanResult => {
//         // 由于此处返回的是一个元素的数组，不便于后续处理，因此需要转义为对象返回
//         if (this._isDefaultScanMode) {
//           matmanResult.data = matmanResult.get(0) as any;
//         }
//
//         return matmanResult;
//       })
//       .then(matmanResult => {
//         // 保存数据快照
//         if (this.matmanResultConfig) {
//           fs.outputJsonSync(this.matmanResultConfig.path, matmanResult);
//         }
//
//         return matmanResult;
//       });
//   }
// }
