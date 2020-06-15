import fs from 'fs';
import path from 'path';

import fse from 'fs-extra';
import Nightmare from 'nightmare';
import puppeteer from 'puppeteer';
import {CrawlerParser} from 'matman-crawler';

import {MatmanConfig} from 'matman-core';
import MatmanResult from './MatmanResult';

import NightmareMaster from './NightmareMaster';
import ScreenshotConfig from './ScreenshotConfig';
import DeviceConfig, {DeviceConfigOpts} from './DeviceConfig';
import CoverageConfig from './CoverageConfig';
import MatmanResultConfig from './MatmanResultConfig';

import {CoverageOrResultOrScreenOpts} from '../types';

export interface NightmareOpts extends Nightmare.IConstructorOptions {
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

export interface PageDriverOpts {
  useRecorder?: boolean;
  doNotCloseBrowser?: boolean;
  tag?: string;
  delayBeforeRun?: number;
  nightmareConfig?: NightmareOpts;
  puppeteerConfig?: puppeteer.LaunchOptions;
  isInIDE?: boolean;
}

/**
 * 页面操作类，使用这个类可以实现对浏览器页面的控制
 */
export default class PageDriver {
  matmanConfig: MatmanConfig;

  caseModuleFilePath: string;
  useRecorder: boolean;
  doNotCloseBrowser: boolean;
  tag: string | undefined;

  delayBeforeRun: number;
  nightmareConfig: NightmareOpts;
  puppeteerConfig: puppeteer.LaunchOptions;
  proxyServer: string;
  mockstarQuery: null | {appendToUrl: (s: string) => string};

  cookies: string | {[key: string]: any};
  deviceConfig: null | DeviceConfig;
  screenshotConfig: null | ScreenshotConfig;
  coverageConfig: null | CoverageConfig;
  matmanResultConfig: null | MatmanResultConfig;

  pageUrl: string;

  nightmareWaitFn: number | string | ((...args: any[]) => number | string);
  nightmareWaitFnArgs: any[];

  nightmareEvaluateFn: null | (() => any) | string;
  nightmareEvaluateFnArgs: any[];

  actionList: ((n: Nightmare | puppeteer.Page) => Nightmare)[];

  _dataIndexMap: {[key: string]: number};
  _isDefaultScanMode: boolean;
  _isInIDE: boolean;

  /**
   * 构造函数
   *
   * @param {MatmanConfig} matmanConfig
   * @param {String} caseModuleFilePath  测试case文件的路径
   * @param {Object} [opts] 参数
   * @param {Object} [opts.delayBeforeRun] 延时多少ms再启动
   * @param {String} [opts.tag] 标记，在某些场景下使用，例如截图保存文件中追加该标记，用于做区分
   * @param {Boolean} [opts.useRecorder] 是否使用记录器
   * @param {Boolean} [opts.doNotCloseBrowser] 是否在执行完成之后不要关闭浏览器，默认为 false
   * @param {Boolean} [opts.nightmareConfig] 传递给 nightmare 的配置
   * @author helinjiang
   */
  constructor(matmanConfig: MatmanConfig, caseModuleFilePath: string, opts: PageDriverOpts = {}) {
    this.matmanConfig = matmanConfig;

    // 测试case文件的路径
    // TODO 需要确保存在
    this.caseModuleFilePath = caseModuleFilePath;

    this.useRecorder = !!opts.useRecorder;
    this.doNotCloseBrowser = !!opts.doNotCloseBrowser;

    this.tag = opts.tag;

    // 特殊处理：如果 this.tag 是存在的文件，则获取文件名
    if (this.tag && fs.existsSync(this.tag)) {
      this.tag = path.basename(this.tag).replace(/\./gi, '_');
    }

    // 延时多少ms再启动
    this.delayBeforeRun = typeof opts.delayBeforeRun === 'number' ? opts.delayBeforeRun : 0;

    this.nightmareConfig = opts.nightmareConfig || {};
    this.puppeteerConfig = opts.puppeteerConfig || {};
    this.proxyServer = '';
    this.mockstarQuery = null;

    this.cookies = '';
    this.deviceConfig = null;
    this.screenshotConfig = null;
    this.coverageConfig = null;
    this.matmanResultConfig = null;

    this.pageUrl = '';

    this.nightmareWaitFn = 500;
    this.nightmareWaitFnArgs = [];

    this.nightmareEvaluateFn = null;
    this.nightmareEvaluateFnArgs = [];

    this.actionList = [];

    this._dataIndexMap = {};
    this._isDefaultScanMode = false;
    this._isInIDE = !!opts.isInIDE;
  }

  /**
   * 基于 nightmare.js 框架，未来可以扩展其他的端对端测试工具
   *
   * 无头浏览器使用 nightmare.js 框架提供，其底层用的是 Google 的 electron，基于 chromium 内核
   *
   * https://www.npmjs.com/package/nightmare#nightmareoptions
   *
   * @param {Object || undefined} nightmareConfig 传递给原生的 Nightmare constructor 的参数
   * @return {PageDriver}
   * @author helinjiang
   */
  useNightmare(nightmareConfig: {[key: string]: any}): PageDriver {
    this.nightmareConfig = nightmareConfig || {};

    return this;
  }

  /**
   * 走指定的代理服务，由代理服务配置请求加载本地项目，从而达到同源测试的目的
   * 若不配置，则之前请求现网，亦可直接测试现网的服务
   *
   * https://github.com/segmentio/nightmare#switches
   *
   * @param {String} proxyServer 代理服务器，格式为 my_proxy_server.example.com:8080，例如 127.0.0.1:8899
   * @return {PageDriver}
   * @author helinjiang
   */
  useProxyServer(proxyServer: string): PageDriver {
    this.proxyServer = proxyServer;

    return this;
  }

  /**
   * TODO 支持动态设置本次请求动态设置规则，
   * 这样可以支持自定义的代理mock数据等场景
   *
   * @param getRulesCall
   * @param opts
   * @return {PageDriver}
   * @author helinjiang
   */
  useWhistle(getRulesCall: () => void, opts = {}): PageDriver {
    // .useWhistle((data) => {
    //     return {
    //         name: `[auto]matman_demo_03_${data.port}`,
    //         rules: [
    //             `www.baidu.com ${path.join(__dirname, '../../../local-project')}/baidu.html`
    //         ]
    //     };
    // }, { autoStartWhistle: true })
    return this;
  }

  /**
   * 使用 mockstar 工具来做接口 mock 数据
   *
   * https://github.com/mockstarjs/mockstar
   *
   * @param {MockStarQuery} mockstarQuery 详见 matman 组件的定义
   * @return {PageDriver}
   * @author helinjiang
   */
  useMockstar(mockstarQuery: {appendToUrl: (s: string) => string}): PageDriver {
    if (!mockstarQuery || typeof mockstarQuery.appendToUrl !== 'function') {
      throw new Error(
        '请传递正确的 MockStarQuery 对象，请参考： https://www.npmjs.com/package/mockstar',
      );
    }

    this.mockstarQuery = mockstarQuery;

    return this;
  }

  /**
   * 注入 cookie
   *
   * https://github.com/helinjiang/nightmare-handler/blob/master/docs/exCookies.md
   * https://github.com/helinjiang/nightmare-handler/tree/master/demo/extend-exCookies
   *
   * @param {String | Object } cookies 支持 `mykey1=myvalue1; mykey2=myvalue2` 和 `{mykey1:'myvalue1', mykey2:'myvalue'}` 写法
   * @return {PageDriver}
   * @author helinjiang
   */
  setCookies(cookies: string | {[key: string]: any}): PageDriver {
    this.cookies = cookies;
    return this;
  }

  /**
   * 设置无头浏览器设备参数
   *
   * https://github.com/helinjiang/nightmare-handler/blob/master/docs/exDevice.md
   *
   * @param {String | Object} deviceConfig 设备名或者设备配置，默认值为 mobile
   * @param {String} [deviceConfig.name] 设备名字
   * @param {String} [deviceConfig.UA] userAgent
   * @param {Number} [deviceConfig.width] 视窗宽度
   * @param {Number} [deviceConfig.height] 视窗高度，注意这里不是指页面的高度，页面高度要小于这个值
   * @return {PageDriver}
   * @author helinjiang
   */
  setDeviceConfig(deviceConfig: DeviceConfigOpts): PageDriver {
    this.deviceConfig = new DeviceConfig(deviceConfig || 'mobile');
    return this;
  }

  /**
   * 设置截屏参数，默认不截图
   *
   * @param {Boolean | String | Object} screenshotConfig
   * @return {PageDriver}
   * @author helinjiang
   */
  setScreenshotConfig(screenshotConfig: CoverageOrResultOrScreenOpts): PageDriver {
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
   * @return {PageDriver}
   * @author helinjiang
   */
  setCoverageConfig(coverageConfig: CoverageOrResultOrScreenOpts): PageDriver {
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
   * @return {PageDriver}
   * @author helinjiang
   */
  setMatmanResultConfig(matmanResultConfig: CoverageOrResultOrScreenOpts): PageDriver {
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
   * @return {PageDriver}
   * @author helinjiang
   */
  goto(pageUrl: string): PageDriver {
    this.pageUrl = pageUrl;
    return this;
  }

  /**
   * 增加测试动作
   *
   * @param {String} actionName 动作名称，后续可通过它来获得最后的数据
   * @param {Function} actionCall 执行函数，接受一个 nightmare 对象，可以直接操作
   * @return {PageDriver}
   * @author helinjiang
   */
  addAction(actionName: string, actionCall: (n: Nightmare) => Nightmare): PageDriver {
    if (typeof actionCall === 'function') {
      this.actionList.push(actionCall);
      this._dataIndexMap[actionName + ''] = this.actionList.length - 1;
    } else if (typeof actionName === 'function') {
      this.actionList.push(actionName);
    } else {
      throw new Error('addAction should assign function!');
    }

    return this;
  }

  /**
   * 需要等待某些条件达成，才开始运行爬虫脚本，与 nightmare 的 wait 含义和用法一致
   *
   * https://www.npmjs.com/package/nightmare#waitms
   * https://www.npmjs.com/package/nightmare#waitselector
   * https://www.npmjs.com/package/nightmare#waitfn-arg1-arg2
   *
   * @param {String | Function} fn
   * @param [args]
   * @return {PageDriver}
   * @author helinjiang
   */
  wait(fn: number | string): PageDriver;
  wait(fn: (...args: any[]) => number | string, ...args: any[]): PageDriver;
  wait(fn: number | string | ((...args: any[]) => number | string), ...args: any[]): PageDriver {
    this.nightmareWaitFn = fn;
    this.nightmareWaitFnArgs = args;

    return this;
  }

  /**
   * 执行爬虫脚本或者方法
   *
   * https://www.npmjs.com/package/nightmare#evaluatefn-arg1-arg2
   *
   * @param {String | Function} fn
   * @param [args]
   * @return {PageDriver}
   * @author helinjiang
   */
  evaluate(fn: string): PageDriver;
  evaluate(fn: () => any, ...args: any[]): PageDriver;
  evaluate(fn: string | (() => any), ...args: any[]): PageDriver {
    if (typeof fn === 'string') {
      // 获取 crawler script 的源文件目录
      // fn 有可能是绝对路径，也可能是相对路径，但都要转为绝对路径
      // 如果是相对路径，则是相对于 caseModuleFilePath 而言的
      const crawlerScriptSrcPath = path.resolve(path.dirname(this.caseModuleFilePath), fn);

      // 调用 crawlerParser 的方法获得该脚本构建之后的路径
      this.nightmareEvaluateFn = new CrawlerParser(this.matmanConfig as any).getCrawlerScriptPath(
        crawlerScriptSrcPath,
      );

      // 有可能地址不存在脚本构建地址，此时给与提示
      if (!this.nightmareEvaluateFn) {
        throw new Error(
          `无法根据 ${fn} 获得构建之后的爬虫脚本文件，请检查文件路径是否正确，或者检查是否执行过构建！`,
        );
      }
    } else {
      this.nightmareEvaluateFn = fn;
      this.nightmareEvaluateFnArgs = args;
    }

    return this;
  }

  /**
   * 执行自定义的方法，适用于 debug 和自定义扩展等场景
   *
   * @param {Function} customFn 自定义函数，会传递 PageDriver 给它
   * @return {PageDriver}
   * @author helinjiang
   */
  executeCustomFn(customFn: (p: PageDriver) => void): PageDriver {
    if (typeof customFn === 'function') {
      customFn(this);
    }
    return this;
  }

  /**
   * 结束，获取结果
   * @return {Promise<{}>}
   * @author helinjiang
   */
  end(): Promise<MatmanResult | PageDriver> {
    // 默认处理 coverage，根据 window.__coverage__
    if (!this.coverageConfig) {
      this.setCoverageConfig(true);
    }

    // 默认处理 matmanResult
    if (!this.matmanResultConfig) {
      this.setMatmanResultConfig(true);
    }

    // 兼容没有定义 run 方法的场景
    if (!this.actionList.length) {
      this._isDefaultScanMode = true;
      this.addAction('_scan_page_', function (nightmareRun) {
        return nightmareRun.wait(500);
      });
    }

    if (this._isInIDE) {
      return new Promise(resolve => {
        resolve(this);
      });
    }

    const nightmareMaster = new NightmareMaster(this);

    return nightmareMaster
      .getResult()
      .then(resultData => {
        return new MatmanResult(resultData);
      })
      .then(matmanResult => {
        // 由于此处返回的是一个元素的数组，不便于后续处理，因此需要转义为对象返回
        if (this._isDefaultScanMode) {
          matmanResult.data = matmanResult.get(0) as any;
        }

        return matmanResult;
      })
      .then(matmanResult => {
        // 保存数据快照
        if (this.matmanResultConfig) {
          fse.outputJsonSync(this.matmanResultConfig.path, matmanResult);
        }

        return matmanResult;
      });
  }
}
