import path from 'path';
import {EventEmitter} from 'events';
import fs from 'fs-extra';
import puppeteer from 'puppeteer';
import {Master, PageDriver} from 'matman-core';
import {evaluate} from './utils/master';

class Puppeteer extends EventEmitter implements Master {
  pageDriver: PageDriver;
  // globalInfoRecorderKey: string;
  puppeteerConfig: puppeteer.LaunchOptions;
  browser: null | puppeteer.Browser;
  page: null | puppeteer.Page;
  // globalInfo: {[key: string]: any};

  constructor(pageDriver: PageDriver, opts: puppeteer.LaunchOptions = {}) {
    super();

    this.pageDriver = pageDriver;

    // 初始化配置
    this.puppeteerConfig = opts;

    // puppeteer 对象
    this.browser = null;
    this.page = null;
  }

  getConfig(): void {
    // 触发开始事件
    this.emit('beforeGetNightmareConfig');

    // 如果设置了 show ，则同步打开开发者工具面板
    if (this.puppeteerConfig.headless === false) {
      this.puppeteerConfig.devtools = true;
    }

    // 如果传入了代理服务，则设置代理服务器
    if (this.pageDriver.proxyServer) {
      if (this.puppeteerConfig.args) {
        this.puppeteerConfig.args = [
          ...this.puppeteerConfig.args,
          `--proxy-server=${this.pageDriver.proxyServer}`,
        ];
      } else {
        this.puppeteerConfig.args = [`--proxy-server=${this.pageDriver.proxyServer}`];
      }
    }

    // 触发时间 广播配置
    this.emit('afterGetNightmareConfig', this.puppeteerConfig);
  }

  async getNewInstance(): Promise<void> {
    this.emit('beforeGetNewNightmare');
    // 创建 puppeteer 对象, 需要创建到 page
    this.browser = await puppeteer.launch(this.puppeteerConfig);
    this.page = (await this.browser.pages())[0];

    // 钩子事件：创建完成之后，可能会有一些自己的处理
    this.emit('afterGetNewNightmare', this);

    // 初始化行为
    this.emit('beforeInitNightmareRun', this.page);

    // 使用记录器，记录网络请求和浏览器事件等 暂时不使用
    // if (this.globalInfoRecorderKey) {
    //   this.globalInfo[this.globalInfoRecorderKey] = new WebEventRecorder(this.nightmare);
    // }

    // 设置额外请求头
    await this.page.setExtraHTTPHeaders({
      'x-mat-from': 'puppeteer',
      'x-mat-timestamp': Date.now() + '',
    });

    // 设置设备
    if (this.pageDriver.deviceConfig) {
      await this.page.setViewport({
        width: this.pageDriver.deviceConfig.width || 1250,
        height: this.pageDriver.deviceConfig.height || 400,
      });
      await this.page.setUserAgent(this.pageDriver.deviceConfig.UA || '');
    }

    // 设置 cookie
    if (this.pageDriver.cookies) {
      const temp: puppeteer.SetCookie[] = [];
      // 简单处理传入的字符串
      if (typeof this.pageDriver.cookies === 'string') {
        this.pageDriver.cookies.split(';').map(item => {
          item = item.trim();
          const res = item.split('=');

          temp.push({
            name: res[0],
            value: res[1],
          });
        });
      } else {
        Object.keys(this.pageDriver.cookies).forEach(item => {
          temp.push({
            name: item,
            value: (this.pageDriver.cookies as any)[item],
          });
        });
      }

      await this.page.setCookie(...temp);
    }

    // 如果有设置符合要求的 matman 服务设置，则还需要额外处理一下
    if (
      this.pageDriver.mockstarQuery &&
      typeof this.pageDriver.mockstarQuery.appendToUrl === 'function'
    ) {
      this.pageDriver.pageUrl = this.pageDriver.mockstarQuery.appendToUrl(this.pageDriver.pageUrl);
    }

    this.emit('afterInitNightmareRun', {
      nightmare: this.page,
    });
  }

  async gotoPage(): Promise<void> {
    this.emit('beforeGotoPage', this.pageDriver.pageUrl);

    this.page?.goto(this.pageDriver.pageUrl);

    // 兼容性处理
    if (typeof this.pageDriver.waitFn === 'number' || typeof this.pageDriver.waitFn === 'string') {
      await this.page?.waitFor(this.pageDriver.waitFn as any);
    }
    // 函数执行结果给 waitFor
    if (typeof this.pageDriver.waitFn === 'function') {
      await this.page?.waitFor(this.pageDriver.waitFn(...this.pageDriver.waitFnArgs) as any);
    }

    this.emit('afterGotoPage', {url: this.pageDriver.pageUrl, page: this.page});
  }

  async runActions(stop?: number): Promise<any[]> {
    // 循环处理多个 action
    const result: any[] = [];
    // 触发开始事件
    this.emit('beforeRunActions', {index: 0, result: result});

    let i = 0;
    const actionList = this.pageDriver.actionList as ((n: puppeteer.Page) => Promise<void>)[];
    const length = actionList.length;

    for (i; i < length; i++) {
      // 停止在某一步
      if (stop && i > stop) {
        break;
      }

      // 开始执行 action
      this.emit('beforeRunCase', {index: i, result: result});

      // 执行 action
      if (!this.page) {
        throw new Error('page must be defined');
      }
      await actionList[i](this.page);

      // 保存屏幕截图
      if (this.pageDriver.screenshotConfig) {
        const screenshotFilePath = this.pageDriver.screenshotConfig.getPathWithId(i + 1);

        // 要保证这个目录存在，否则保存时会报错
        fs.ensureDirSync(path.dirname(screenshotFilePath));

        await this.page.screenshot({path: screenshotFilePath});
      }

      // 如果使用了记录器，则每个请求都延迟 50ms，注意是因为 network 是异步的
      // TODO 这里的处理过于粗暴，还可以优化
      // if (this.globalInfoRecorderKey) {
      //   curRun = curRun.wait(50);
      // }

      let t: any;
      if (typeof this.pageDriver.evaluateFn === 'function') {
        t = await this.page.evaluate(this.pageDriver.evaluateFn, ...this.pageDriver.evaluateFnArgs);
      } else {
        t = await this.page.evaluate(evaluate);
      }

      // 覆盖率数据
      // if (t.__coverage__ && this.pageDriver.coverageConfig) {
      //   const coverageFilePath = this.pageDriver.coverageConfig.getPathWithId(i + 1);

      //   try {
      //     await fs.outputJson(coverageFilePath, t.__coverage__);

      //     // 设置存在的标志
      //     this.globalInfo.isExistCoverageReport = true;

      //     // 记录之后就删除之，否则返回的数据太大了
      //     delete t.__coverage__;
      //   } catch (e) {
      //     console.log('save coverage file fail', coverageFilePath, e);
      //   }
      // }

      result.push(t);

      // 结束执行 action
      this.emit('afterRunCase', {index: i, result: result});
    }

    this.emit('afterRunActions', {index: i, result: result});

    return result;
  }

  cleanEffect(): void {
    console.log('empty');
  }

  async getResult() {
    await this.getConfig();

    await this.getNewInstance();

    await this.gotoPage();

    const result = await this.runActions();

    this.cleanEffect();

    return {
      data: result,
      _dataIndexMap: this.pageDriver._dataIndexMap,
      // globalInfo: this.globalInfo,
    };
  }
}

export default Puppeteer;
