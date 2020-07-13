import path from 'path';
import {EventEmitter} from 'events';
import fs from 'fs-extra';
import puppeteer from 'puppeteer';
import {BrowserRunner, PageDriver, MatmanResult, MatmanResultQueueItem} from 'matman-core';
import {build} from 'matman-crawler';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {createMockStarQuery} from 'mockstar';
import {evaluate} from './utils/master';

export class PuppeteerRunner extends EventEmitter implements BrowserRunner {
  name = 'puppeteer';
  pageDriver: PageDriver | null;
  puppeteerConfig: puppeteer.LaunchOptions;
  browser: null | puppeteer.Browser;
  page: null | puppeteer.Page;
  globalInfo: {
    recorder?: {
      queue: MatmanResultQueueItem[];
      allRequestUrl: string[];
    };
    isExistCoverageReport?: boolean;
  };

  constructor(opts: puppeteer.LaunchOptions = {}) {
    super();

    this.pageDriver = null;

    // 初始化配置
    this.puppeteerConfig = opts;

    // puppeteer 对象
    this.browser = null;
    this.page = null;

    this.globalInfo = {};
  }

  setPageDriver(n: PageDriver): void {
    this.pageDriver = n;

    if (this.pageDriver?.useRecorder) {
      this.globalInfo.recorder = {
        queue: [],
        allRequestUrl: [],
      };
    }
  }

  async getConfig(): Promise<void> {
    // 触发开始事件
    this.emit('beforeGetConfig');

    this.puppeteerConfig.args = this.puppeteerConfig.args || [];

    if (this.pageDriver) {
      if (this.pageDriver.show) {
        this.puppeteerConfig.headless = false;
      }

      // 如果传入了代理服务，则设置代理服务器
      if (this.pageDriver.proxyServer) {
        this.puppeteerConfig.args.push(`--proxy-server=${this.pageDriver.proxyServer}`);
      }
    }

    if (process.env.IS_IN_IDE) {
      this.puppeteerConfig.headless = false;
    }

    // 取消安全限制
    // Don't enforce the same-origin policy. (Used by people testing their sites.)
    // https://stackoverflow.com/questions/52129649/puppeteer-cors-mistake/52131823
    // https://peter.sh/experiments/chromium-command-line-switches/#disable-web-security
    this.puppeteerConfig.args.push('--disable-web-security');

    // Disables the sandbox for all process types that are normally sandboxed.
    // https://peter.sh/experiments/chromium-command-line-switches/#no-sandbox
    this.puppeteerConfig.args.push('--no-sandbox');

    // Disable the setuid sandbox (Linux only).
    // https://peter.sh/experiments/chromium-command-line-switches/#disable-setuid-sandbox
    this.puppeteerConfig.args.push('--disable-setuid-sandbox');

    // 如果设置了 show ，则同步打开开发者工具面板
    // puppeteer 场景下不需要这么做，可以人工打开，因此不再有必要这么处理了
    // if (this.puppeteerConfig.headless === false) {
    //   this.puppeteerConfig.devtools = true;
    // }

    // 如果传入了浏览器则使用
    this.puppeteerConfig.executablePath = this.pageDriver?.executablePath;
    if (
      this.puppeteerConfig.executablePath &&
      /firefox/gi.test(this.puppeteerConfig.executablePath)
    ) {
      this.puppeteerConfig.product = 'firefox';
    }

    // 触发广播配置
    this.emit('afterGetConfig', this.puppeteerConfig);
  }

  async getNewInstance(): Promise<void> {
    this.emit('beforeGetNewInstance');
    // 创建 puppeteer 对象, 需要创建到 page
    this.browser = await puppeteer.launch(this.puppeteerConfig);
    this.page = (await this.browser.pages())[0];

    // 钩子事件：创建完成之后，可能会有一些自己的处理
    this.emit('afterGetNewInstance', this);

    // 初始化行为
    this.emit('beforeInitNewInstance', this.page);

    // 使用 mockstar 作为 mock server
    if (this.pageDriver?.mockstarConfig) {
      this.page.on('request', request => {
        // console.log('\npageUrl', this.pageDriver?.pageUrl);
        // console.log('request.resourceType()', request.resourceType());
        // console.log('request.url()', request.url());

        if (request.resourceType() === 'xhr' || request.resourceType() === 'fetch') {
          // 必须放在这里，每次都实时获取，后续在更换 mockstar 桩数据时才会生效
          const mockstarQuery = createMockStarQuery(
            this.pageDriver?.mockstarConfig?.queryDataMap as any,
          );
          const mockstarQueryString = mockstarQuery.getString();

          // Override headers
          const headers = Object.assign({}, request.headers(), {
            'x-mockstar-query': encodeURIComponent(mockstarQueryString),
          });

          request.continue({headers});
        } else {
          request.continue();
        }
      });
    }

    // 使用记录器，记录网络请求和浏览器事件等 暂时不使用
    if (this.globalInfo.recorder) {
      this.page.on('response', async msg => {
        const request = msg.request();

        let responseBody = null;
        if (msg.headers()['content-type'] === 'application/json') {
          try {
            responseBody = await msg.json();
          } catch (e) {
            // TODO 部分场景下可能报错，待定位
            // UnhandledPromiseRejectionWarning: SyntaxError: Unexpected token / in JSON at position 0
          }
        }

        this.addRecordInQueue({
          eventName: 'network',
          url: request.url(),
          method: request.method(),
          // https://github.com/puppeteer/puppeteer/blob/v4.0.0/docs/api.md#httprequestresourcetype
          resourceType: request.resourceType(),
          request: {
            headers: request.headers() || {},
            postData: request.postData(),
          },
          response: {
            ok: msg.ok(),
            status: msg.status(),
            statusText: msg.statusText(),
            headers: msg.headers(),
            fromCache: msg.fromCache(),
            body: responseBody,
          },
        } as MatmanResultQueueItem);
      });

      this.page.on('console', log => {
        this.addRecordInQueue({
          eventName: 'console',
          type: log.type(),
          // args: log.args(),
          // location: log.location(),
          text: log.text(),
        } as MatmanResultQueueItem);
      });

      this.page.on('request', request => {
        this.globalInfo.recorder?.allRequestUrl?.push(request.url());
      });
    }

    // 使用 mockstar 作为 mock server
    if (this.pageDriver?.mockstarConfig) {
      await this.page.setRequestInterception(true);
    }

    // 设置额外请求头
    await this.page.setExtraHTTPHeaders({
      'x-mat-from': 'puppeteer',
      'x-mat-timestamp': Date.now() + '',
    });

    // 设置设备
    if (this.pageDriver?.deviceConfig) {
      const deviceName = this.pageDriver.deviceConfig.name;
      const deviceeExtend = this.pageDriver.deviceConfig.extend || '';

      // https://github.com/puppeteer/puppeteer/blob/v4.0.0/docs/api.md#puppeteerdevices
      const curDeviceExtend = puppeteer.devices[deviceeExtend];
      if (curDeviceExtend) {
        this.pageDriver.deviceConfig.updateExtend(curDeviceExtend);
      }

      const curDevice = puppeteer.devices[deviceName];
      if (curDevice) {
        this.pageDriver.deviceConfig.updateExtend(curDevice);
      }

      await this.page.emulate(this.pageDriver.deviceConfig.getConfig());
    }

    // 设置 cookie
    if (this.pageDriver?.cookieConfig) {
      const temp: puppeteer.SetCookie[] = [];
      const arr = this.pageDriver.cookieConfig.getCookieObjectArr(this.pageDriver?.pageUrl);

      arr.forEach(item => {
        temp.push(item);
      });

      await this.page.setCookie(...temp);
    }

    this.emit('afterInitNewInstance', {
      nightmare: this.page,
    });
  }

  async gotoPage(): Promise<void> {
    this.emit('beforeGotoPage', this.pageDriver?.pageUrl);

    if (!this.pageDriver?.pageUrl) {
      throw new Error('pageUrl must be defined');
    }

    await this.page?.goto(this.pageDriver?.pageUrl);

    // 注入脚本
    // 因为有时需要注入脚本 所以必须进行文件的保存与注入
    if (typeof this.pageDriver.evaluateFn === 'string') {
      const res = await build(this.pageDriver.evaluateFn, {
        matmanConfig: this.pageDriver.matmanConfig,
      });
      this.page?.evaluate(res);
    } else {
      fs.ensureDirSync(`${process.env.HOME}/.matman`);

      fs.writeFileSync(
        `${process.env.HOME}/.matman/temp.js`,
        `module.exports=${this.pageDriver.evaluateFn?.toString()}`,
      );
      const res = await build(`${process.env.HOME}/.matman/temp.js`, {
        matmanConfig: this.pageDriver.matmanConfig,
      });
      this.page?.evaluate(res);
    }

    this.emit('afterGotoPage', {url: this.pageDriver?.pageUrl, page: this.page});
  }

  async runActions(stop?: number): Promise<any[]> {
    // 循环处理多个 action
    const result: any[] = [];
    // 触发开始事件
    this.emit('beforeRunActions', {index: 0, result: result});

    let i = 0;
    const actionList = this.pageDriver?.actionList as ((n: puppeteer.Page) => Promise<void>)[];
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
      if (this.pageDriver?.screenshotConfig) {
        const screenshotFilePath = this.pageDriver.screenshotConfig.getPathWithId(i + 1);

        const opts: puppeteer.BinaryScreenShotOptions = {
          path: screenshotFilePath,
          clip: this.pageDriver.screenshotConfig.clip,
          fullPage: this.pageDriver.screenshotConfig.fullPage,
        };

        // 要保证这个目录存在，否则保存时会报错
        fs.ensureDirSync(path.dirname(screenshotFilePath));

        await this.page.screenshot(opts);
      }

      // 如果使用了记录器，则每个请求都延迟 50ms，注意是因为 network 是异步的
      // TODO 这里的处理过于粗暴，还可以优化
      // if (this.globalInfoRecorderKey) {
      //   curRun = curRun.wait(50);
      // }

      const t = await this.page.evaluate(evaluate);

      // 覆盖率数据
      if (t.__coverage__ && this.pageDriver?.coverageConfig) {
        const coverageFilePath = this.pageDriver.coverageConfig.getPathWithId(i + 1);

        try {
          await fs.outputJson(coverageFilePath, t.__coverage__);

          // 设置存在的标志
          this.globalInfo.isExistCoverageReport = true;

          // 记录之后就删除之，否则返回的数据太大了
          delete t.__coverage__;
        } catch (e) {
          console.log('save coverage file fail', coverageFilePath, e);
        }
      }

      result.push(t);

      // 结束执行 action
      this.emit('afterRunCase', {index: i, result: result});
    }

    this.emit('afterRunActions', {index: i, result: result});

    return result;
  }

  async cleanEffect(): Promise<void> {
    // 如果配置了不关闭界面，且当前是展示浏览器界面的场景，则不再自动关闭浏览器界面，以方便调试
    if (
      (process.env.IS_IN_IDE || this.pageDriver?.doNotCloseBrowser) &&
      this.puppeteerConfig.headless === false
    ) {
      console.log('do not close browser');
    } else {
      await this.browser?.close();
    }
  }

  async getResult(): Promise<MatmanResult> {
    await this.getConfig();

    await this.getNewInstance();

    await this.gotoPage();

    const result = await this.runActions();

    await this.cleanEffect();

    return new MatmanResult({
      runnerName: this.name,
      data: result,
      dataIndexMap: this.pageDriver?.dataIndexMap || {},
      globalInfo: this.globalInfo,
    });
  }

  addRecordInQueue(queueItem: MatmanResultQueueItem): void {
    this.globalInfo.recorder?.queue?.push(queueItem);
  }
}
