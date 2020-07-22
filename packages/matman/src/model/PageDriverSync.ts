import path from 'path';
import fs from 'fs-extra';
import puppeteer from 'puppeteer';
import Nightmare from 'nightmare';
import {
  MatmanConfig,
  PageDriver,
  DeviceConfig,
  ScreenshotConfig,
  CoverageConfig,
  MatmanResultConfig,
  DeviceConfigOpts,
  ScreenOpts,
  CoverageOpts,
  ResultOpts,
  BrowserRunner,
  CookieConfig,
  CookieConfigOpts,
  MatmanResult,
  MockstarConfig,
  MockstarQueryDataMap,
} from 'matman-core';

import { PageDriverOpts } from '../types';

/**
 * 页面操作类，使用这个类可以实现对浏览器页面的控制
 */
export default class PageDriverSync implements PageDriver {
  // 配置项目
  matmanConfig: MatmanConfig;
  caseModuleFilePath: string;
  show: boolean;
  doNotCloseBrowser: boolean;
  useRecorder: boolean;
  tag: string | undefined;
  delayBeforeRun: number;
  executablePath: string | undefined;
  proxyServer: string;
  mockstarConfig: null | MockstarConfig;
  cookieConfig: null | CookieConfig;
  deviceConfig: null | DeviceConfig;
  screenshotConfig: null | ScreenshotConfig;
  coverageConfig: null | CoverageConfig;
  matmanResultConfig: null | MatmanResultConfig;

  // 页面信息
  pageUrl: string;
  evaluateFn: null | (() => any) | string;
  evaluateFnArgs: any[];
  actionList: ((n: Nightmare & puppeteer.Page) => Nightmare | Promise<void>)[];
  dataIndexMap: { [key: string]: number };

  // master
  private browserRunner: BrowserRunner;

  /**
   * 构造函数
   *
   * @param {Runner} browserRunner
   * @param {MatmanConfig} matmanConfig
   * @param {Object} [opts] 参数
   * @param {Object} [opts.delayBeforeRun] 延时多少ms再启动
   * @param {String} [opts.tag] 标记，在某些场景下使用，例如截图保存文件中追加该标记，用于做区分
   * @param {Boolean} [opts.useRecorder] 是否使用记录器
   * @param {Boolean} [opts.doNotCloseBrowser] 是否在执行完成之后不要关闭浏览器，默认为 false
   * @param {Boolean} [opts.nightmareConfig] 传递给 nightmare 的配置
   * @author helinjiang
   */
  constructor(browserRunner: BrowserRunner, matmanConfig: MatmanConfig, opts: PageDriverOpts) {
    this.browserRunner = browserRunner;

    this.matmanConfig = matmanConfig;

    this.caseModuleFilePath = opts.caseModuleFilePath;

    this.show = !!opts.show;
    this.doNotCloseBrowser = !!opts.doNotCloseBrowser;
    this.useRecorder = !!opts.useRecorder;

    this.tag = opts.tag;

    // 特殊处理：如果 this.tag 是存在的文件，则获取文件名
    if (this.tag && fs.existsSync(this.tag)) {
      this.tag = path.basename(this.tag).replace(/\./gi, '_');
    }

    // 延时多少ms再启动
    this.delayBeforeRun = typeof opts.delayBeforeRun === 'number' ? opts.delayBeforeRun : 0;

    this.executablePath = opts.executablePath;

    this.proxyServer = '';

    this.mockstarConfig = null;
    this.cookieConfig = null;
    this.deviceConfig = null;
    this.screenshotConfig = null;
    this.coverageConfig = null;
    this.matmanResultConfig = null;

    this.pageUrl = '';

    this.evaluateFn = null;
    this.evaluateFnArgs = [];

    this.actionList = [];

    this.dataIndexMap = {};
  }

  getRunner(): BrowserRunner {
    return this.browserRunner;
  }

  /**
   * 走指定的代理服务，由代理服务配置请求加载本地项目，从而达到同源测试的目的
   * 若不配置，则之前请求现网，亦可直接测试现网的服务
   *
   * https://github.com/segmentio/nightmare#switches
   *
   * @param {String} proxyServer 代理服务器，格式为 my_proxy_server.example.com:8080，例如 127.0.0.1:8899
   * @return {PageDriverSync}
   * @author helinjiang
   */
  useProxyServer(proxyServer: string): PageDriverSync {
    this.proxyServer = proxyServer;

    return this;
  }

  /**
   * 使用 mockstar 工具来做接口 mock 数据
   *
   * https://github.com/mockstarjs/mockstar
   *
   * @return {PageDriverSync}
   * @author helinjiang
   */
  useMockstar(queryDataMap: MockstarQueryDataMap): PageDriverSync {
    this.mockstarConfig = new MockstarConfig({ queryDataMap });

    return this;
  }

  /**
   * 更新 mockstar 中的请求
   *
   * https://github.com/mockstarjs/mockstar
   *
   * @return {PageDriver}
   * @author helinjiang
   */
  changeMockstar(queryDataMap: MockstarQueryDataMap): PageDriverSync {
    if (this.mockstarConfig) {
      this.mockstarConfig.update(queryDataMap);
    }

    return this;
  }

  /**
   * 注入 cookie
   *
   * https://github.com/helinjiang/nightmare-handler/blob/master/docs/exCookies.md
   * https://github.com/helinjiang/nightmare-handler/tree/master/demo/extend-exCookies
   *
   * @param {CookieConfigOpts } cookieConfigOpts 支持 `mykey1=myvalue1; mykey2=myvalue2` 和 `{mykey1:'myvalue1', mykey2:'myvalue'}` 写法
   * @return {PageDriverSync}
   * @author helinjiang
   */
  setCookieConfig(cookieConfigOpts: CookieConfigOpts): PageDriverSync {
    this.cookieConfig = new CookieConfig(cookieConfigOpts);
    return this;
  }

  /**
   * 设置无头浏览器设备参数
   *
   * https://github.com/helinjiang/nightmare-handler/blob/master/docs/exDevice.md
   *
   * @param {DeviceConfigOpts} deviceConfig 设备名或者设备配置
   * @return {PageDriverSync}
   * @author helinjiang
   */
  setDeviceConfig(deviceConfig: DeviceConfigOpts): PageDriverSync {
    this.deviceConfig = new DeviceConfig(deviceConfig);
    return this;
  }

  /**
   * 设置截屏参数，默认不截图
   *
   * @param {Boolean | String | Object} screenshotConfig
   * @return {PageDriverSync}
   * @author helinjiang
   */
  setScreenshotConfig(screenshotConfig: ScreenOpts): PageDriverSync {
    if (screenshotConfig) {
      this.screenshotConfig = new ScreenshotConfig(
        this.matmanConfig,
        screenshotConfig,
        this.caseModuleFilePath,
        this.tag,
      );
    }
    return this;
  }

  /**
   * 设置覆盖率参数
   *
   * @param {Boolean | String | Object} coverageConfig
   * @return {PageDriverSync}
   * @author helinjiang
   */
  setCoverageConfig(coverageConfig: CoverageOpts): PageDriverSync {
    if (coverageConfig) {
      this.coverageConfig = new CoverageConfig(
        this.matmanConfig,
        coverageConfig,
        this.caseModuleFilePath,
        this.tag,
      );
    }

    return this;
  }

  /**
   * 设置 MatmanResult 执行结果参数
   *
   * @param {Boolean | String | Object} matmanResultConfig
   * @return {PageDriverSync}
   * @author helinjiang
   */
  setMatmanResultConfig(matmanResultConfig: ResultOpts): PageDriverSync {
    if (matmanResultConfig) {
      this.matmanResultConfig = new MatmanResultConfig(
        this.matmanConfig,
        matmanResultConfig,
        this.caseModuleFilePath,
        this.tag,
      );
    }

    return this;
  }

  /**
   * 加载指定的页面地址
   *
   * @param pageUrl
   * @return {PageDriverSync}
   * @author helinjiang
   */
  setPageUrl(pageUrl: string): PageDriverSync {
    this.pageUrl = pageUrl;
    return this;
  }

  /**
   * 增加测试动作
   *
   * @param {String} actionName 动作名称，后续可通过它来获得最后的数据
   * @param {Function} actionCall 执行函数，接受一个 nightmare 对象，可以直接操作
   * @return {PageDriverSync}
   * @author helinjiang
   */
  addAction(
    actionName: string,
    actionCall: (n: Nightmare & puppeteer.Page) => Nightmare | Promise<void>,
  ): PageDriverSync {
    if (typeof actionCall === 'function') {
      this.actionList.push(actionCall);
      this.dataIndexMap[actionName + ''] = this.actionList.length - 1;
    } else if (typeof actionName === 'function') {
      this.actionList.push(actionName);
    } else {
      throw new Error('addAction should assign function!');
    }

    return this;
  }

  /**
   * 执行爬虫脚本或者方法
   *
   * https://www.npmjs.com/package/nightmare#evaluatefn-arg1-arg2
   *
   * @param {String | Function} fn
   * @param [args]
   * @return {PageDriverSync}
   * @author helinjiang
   */
  evaluate(fn: string): Promise<MatmanResult | PageDriverSync>;
  evaluate(fn: () => any, ...args: any[]): Promise<MatmanResult | PageDriverSync>;
  evaluate(fn: string | (() => any), ...args: any[]): Promise<MatmanResult | PageDriverSync> {
    this.evaluateFn = fn;
    this.evaluateFnArgs = args;

    // 直接返回结果
    return this.getResult();
  }

  /**
   * 结束，获取结果
   * @return {Promise<{}>}
   * @author helinjiang
   */
  getResult(): Promise<MatmanResult | PageDriverSync> {
    // 如果没有 actionList 则直接抛出错误
    if (!this.actionList.length) {
      throw new Error('No action! Please use addAction(name, callback) to add your actions!');
    }

    // 默认处理 coverage，根据 window.__coverage__
    if (!this.coverageConfig) {
      this.setCoverageConfig(true);
    }

    // 默认处理 matmanResult
    if (!this.matmanResultConfig) {
      this.setMatmanResultConfig(true);
    }

    // 默认处理 deviceConfig
    if (!this.deviceConfig) {
      this.setDeviceConfig('mobile');
    }

    this.browserRunner?.setPageDriver(this);

    if (process.env.IS_IN_IDE) {
      return new Promise(resolve => {
        resolve(this);
      });
    }

    return this.browserRunner?.getResult().then(matmanResult => {
      // 保存数据快照
      if (this.matmanResultConfig) {
        this.matmanResultConfig.save(matmanResult);
      }

      return matmanResult;
    });
  }
}
