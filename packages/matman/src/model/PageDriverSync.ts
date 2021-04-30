import path from 'path';
import fs from 'fs-extra';
import puppeteer from 'puppeteer';
import Nightmare from 'nightmare';
import {
  MatmanConfig,
  IPageDriver,
  DeviceConfig,
  ScreenshotConfig,
  CoverageConfig,
  MatmanResultConfig,
  IDeviceConfigOpts,
  IScreenOpts,
  ICoverageOpts,
  IResultOpts,
  IBrowserRunner,
  CookieConfig,
  ICookieConfigOpts,
  MatmanResult,
  MockstarConfig,
  IMockstarQueryDataMap,
} from 'matman-core';

import { IPageDriverOpts } from '../types';

/**
 * 页面操作类，使用这个类可以实现对浏览器页面的控制
 */
export default class PageDriverSync implements IPageDriver {
  // 配置项目
  public matmanConfig: MatmanConfig;
  public caseModuleFilePath: string;
  public show: boolean;
  public doNotCloseBrowser: boolean;
  public useRecorder: boolean;
  public tag: string | undefined;
  public delayBeforeRun: number;
  public executablePath: string | undefined;
  public proxyServer: string;
  public mockstarConfig: null | MockstarConfig;
  public cookieConfig: null | CookieConfig;
  public deviceConfig: null | DeviceConfig;
  public screenshotConfig: null | ScreenshotConfig;
  public coverageConfig: null | CoverageConfig;
  public matmanResultConfig: null | MatmanResultConfig;

  // 页面信息
  public pageUrl: string;
  public evaluateFn: null | (() => any) | string;
  public evaluateFnArgs: any[];
  public actionList: ((n: Nightmare & puppeteer.Page) => Nightmare | Promise<void>)[];
  public isRunList: number[] = [];
  public dataIndexMap: { [key: string]: number };

  // master
  private readonly browserRunner: IBrowserRunner;

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
   */
  public constructor(
    browserRunner: IBrowserRunner,
    matmanConfig: MatmanConfig,
    opts: IPageDriverOpts,
  ) {
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

  public getRunner(): IBrowserRunner {
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
   */
  public useProxyServer(proxyServer: string): PageDriverSync {
    this.proxyServer = proxyServer;

    return this;
  }

  /**
   * 使用 mockstar 工具来做接口 mock 数据
   *
   * https://github.com/mockstarjs/mockstar
   *
   * @return {PageDriverSync}
   */
  public useMockstar(queryDataMap: IMockstarQueryDataMap): PageDriverSync {
    this.mockstarConfig = new MockstarConfig({ queryDataMap });

    return this;
  }

  /**
   * 更新 mockstar 中的请求
   *
   * https://github.com/mockstarjs/mockstar
   *
   * @return {IPageDriver}
   */
  public changeMockstar(queryDataMap: IMockstarQueryDataMap): PageDriverSync {
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
   * @param {ICookieConfigOpts } cookieConfigOpts 支持 `mykey1=myvalue1; mykey2=myvalue2`
   * 和 `{mykey1:'myvalue1', mykey2:'myvalue'}` 写法
   * @return {PageDriverSync}
   */
  public setCookieConfig(cookieConfigOpts: ICookieConfigOpts): PageDriverSync {
    this.cookieConfig = new CookieConfig(cookieConfigOpts);
    return this;
  }

  /**
   * 设置无头浏览器设备参数
   *
   * https://github.com/helinjiang/nightmare-handler/blob/master/docs/exDevice.md
   *
   * @param {IDeviceConfigOpts} deviceConfig 设备名或者设备配置
   * @return {PageDriverSync}
   */
  public setDeviceConfig(deviceConfig: IDeviceConfigOpts): PageDriverSync {
    this.deviceConfig = new DeviceConfig(deviceConfig);
    return this;
  }

  /**
   * 设置截屏参数，默认不截图
   *
   * @param {Boolean | String | Object} screenshotConfig
   * @return {PageDriverSync}
   */
  public setScreenshotConfig(screenshotConfig: IScreenOpts): PageDriverSync {
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
   */
  public setCoverageConfig(coverageConfig: ICoverageOpts): PageDriverSync {
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
   */
  public setMatmanResultConfig(matmanResultConfig: IResultOpts): PageDriverSync {
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
   */
  public setPageUrl(pageUrl: string): PageDriverSync {
    this.pageUrl = pageUrl;
    return this;
  }

  /**
   * 增加测试动作
   *
   * @param {String} actionName 动作名称，后续可通过它来获得最后的数据
   * @param {Function} actionCall 执行函数，接受一个 nightmare 对象，可以直接操作
   * @return {PageDriverSync}
   */
  public addAction(
    actionName: string,
    actionCall: (n: Nightmare & puppeteer.Page) => Nightmare | Promise<void>,
  ): PageDriverSync {
    if (typeof actionCall === 'function') {
      this.actionList.push(actionCall);
      // 注意 run 引入后需要统计的是前面有多少个非 run action
      this.dataIndexMap[`${actionName}`] = this.isRunList.reduce(
        (count, value) => (value === 0 ? count + 1 : count),
        0,
      );
    } else if (typeof actionName === 'function') {
      this.actionList.push(actionName);
    } else {
      throw new Error('addAction should assign function!');
    }

    this.isRunList.push(0);

    return this;
  }

  /**
   * 增加执行动作
   *
   * @param {Function} actionCall 执行函数，接受一个 nightmare 或者 puppeteer 对象，可以直接操作
   * @return {Promise<void>}
   */
  public addRunAction(actionCall: (n: Nightmare & puppeteer.Page) => Nightmare | Promise<void>): IPageDriver {
    if (typeof actionCall !== 'function') {
      throw new Error('addRunAction should assign function!');
    }
    this.actionList.push(actionCall);
    this.isRunList.push(1);

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
   */
  public evaluate(fn: string): Promise<MatmanResult | PageDriverSync>;
  public evaluate(fn: () => any, ...args: any[]): Promise<MatmanResult | PageDriverSync>;
  public evaluate(
    fn: string | (() => any),
    ...args: any[]
  ): Promise<MatmanResult | PageDriverSync> {
    this.evaluateFn = fn;
    this.evaluateFnArgs = args;

    // 直接返回结果
    return this.getResult();
  }

  /**
   * 结束，获取结果
   * @return {Promise<{}>}
   */
  public getResult(): Promise<MatmanResult | PageDriverSync> {
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
      return new Promise((resolve) => {
        resolve(this);
      });
    }

    return this.browserRunner?.getResult().then((matmanResult) => {
      // 保存数据快照
      if (this.matmanResultConfig) {
        this.matmanResultConfig.save(matmanResult);
      }

      return matmanResult;
    });
  }
}
