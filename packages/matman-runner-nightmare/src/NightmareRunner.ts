import path from 'path';
import { EventEmitter } from 'events';
import fs from 'fs-extra';
import Nightmare from 'nightmare';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { getNightmarePlus, WebEventRecorder } from 'nightmare-handler';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { createMockStarQuery } from 'mockstar';
import {
  BrowserRunner,
  PageDriver,
  MatmanResult,
  MatmanResultQueueItem,
  RUNNER_NAME,
} from 'matman-core';
import { build } from 'matman-crawler';
import { getMainUrl, evaluate } from './utils';

/**
 * 对 nightmare 的接口进行拓展
 */
export interface NightmareLaunchOptions extends Nightmare.IConstructorOptions {
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

export class NightmareRunner extends EventEmitter implements BrowserRunner {
  name = RUNNER_NAME.NIGHTMARE;
  pageDriver: PageDriver | null;
  nightmareConfig: NightmareLaunchOptions;
  nightmare: null | Nightmare;
  globalInfo: {
    recorder?: {
      queue: MatmanResultQueueItem[];
      allRequestUrl: string[];
    };
    isExistCoverageReport?: boolean;
  };

  /**
   * 构造函数
   */
  constructor(opts: NightmareLaunchOptions = {}) {
    // 基类构造函数
    super();

    this.pageDriver = null;

    // 初始化配置
    this.nightmareConfig = opts || {};

    // nightmare 对象
    this.nightmare = null;

    // 存储网络请求和浏览器事件等信息
    this.globalInfo = {};
  }

  setPageDriver(p: PageDriver): void {
    this.pageDriver = p;
  }

  /**
   * 得到 nightmare 的配置
   */
  async getConfig(): Promise<void> {
    // 触发开始事件
    this.emit('beforeGetConfig');

    if (this.pageDriver) {
      if (this.pageDriver.show) {
        this.nightmareConfig.show = true;
      }

      // 如果传入了代理服务，则设置代理服务器
      if (this.pageDriver.proxyServer) {
        this.nightmareConfig.switches = {
          'proxy-server': this.pageDriver.proxyServer,

          // 必须设置一下这个，否则在某些情况下 https 地址无法使用
          // https://github.com/matmanjs/matman/issues/159
          'ignore-certificate-errors': true,
        };
      }
    }

    if (process.env.IS_IN_IDE) {
      this.nightmareConfig.show = true;
    }

    // 如果设置了 show ，则同步打开开发者工具面板
    if (this.nightmareConfig.show) {
      // https://www.npmjs.com/package/nightmare#opendevtools
      this.nightmareConfig.openDevTools = {
        mode: 'detach',
      };
    }

    // 触发时间 广播配置
    this.emit('afterGetConfig', this.nightmareConfig);
  }

  /**
   * 得到 nightmare 的一个实例
   * 并初始化一些行为
   */
  async getNewInstance(): Promise<void> {
    this.emit('beforeGetNewInstance');

    // 创建 nightmare 对象，注意使用扩展的 NightmarePlus ，而不是原生的 Nightmare
    const NightmarePlus = getNightmarePlus();
    this.nightmare = NightmarePlus(this.nightmareConfig);

    // 钩子事件：创建完成之后，可能会有一些自己的处理
    this.emit('afterGetNewInstance', this);

    // 初始化行为
    this.emit('beforeInitNewInstance', this.nightmare);

    // 使用记录器，记录网络请求和浏览器事件等
    if (this.pageDriver?.useRecorder) {
      this.globalInfo.recorder = new WebEventRecorder(this.nightmare);

      // TODO nightmare 中 allRequestUrl 暂未实现
      if (this.globalInfo.recorder) {
        this.globalInfo.recorder.allRequestUrl = [];
      }
    }

    if (!this.nightmare) {
      throw new Error('nightmare must be defined');
    }

    // 初始化一些行为
    this.nightmare.header('x-mat-from', 'nightmare').header('x-mat-timestamp', Date.now() + '');

    // 设置设备
    if (this.pageDriver?.deviceConfig) {
      // 特殊处理，如果 name=mobile，则设置默认值，
      // 参考 https://github.com/puppeteer/puppeteer/blob/main/src/common/DeviceDescriptors.ts
      if (this.pageDriver.deviceConfig.extend === 'iPhone 6') {
        this.pageDriver.deviceConfig.updateExtend({
          name: 'iPhone 6',
          userAgent:
            'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
          viewport: {
            width: 375,
            height: 667,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
          },
        });
      }

      const deviceConfigResult = this.pageDriver.deviceConfig.getConfig();

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.nightmare.exDevice(deviceConfigResult.name, {
        UA: deviceConfigResult.userAgent,
        width: deviceConfigResult.viewport?.width,
        height: deviceConfigResult.viewport?.height,
      });
    }

    // 设置 cookie
    if (this.pageDriver?.cookieConfig) {
      const cookieStr = this.pageDriver.cookieConfig.getCookieStr();
      if (cookieStr) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.nightmare.exCookies(cookieStr, getMainUrl(this.pageDriver.pageUrl));
      }
    }

    // 如果有设置符合要求的 matman 服务设置，则还需要额外处理一下
    if (this.pageDriver?.mockstarConfig?.queryDataMap) {
      // 必须放在这里，每次都实时获取，后续在更换 mockstar 桩数据时才会生效
      const mockstarQuery = createMockStarQuery(this.pageDriver?.mockstarConfig?.queryDataMap);

      this.pageDriver.pageUrl = mockstarQuery.appendToUrl(this.pageDriver.pageUrl);
    }

    this.emit('afterInitNewInstance', {
      nightmare: this.nightmare,
    });
  }

  /**
   * 打开界面
   */
  async gotoPage(): Promise<void> {
    this.emit('beforeGotoPage', this.pageDriver?.pageUrl);

    if (!this.nightmare) {
      throw new Error('nightmare must be defined');
    }

    if (!this.pageDriver?.pageUrl) {
      throw new Error('pageUrl must be defined');
    }

    this.nightmare.goto(this.pageDriver?.pageUrl);

    // 新建启动脚本
    // 如果传递给 evaluate 的是一个本地绝对路径文件，则需要设置 preload
    if (typeof this.pageDriver?.evaluateFn === 'string') {
      let res = await build(this.pageDriver?.evaluateFn, {
        matmanConfig: this.pageDriver.matmanConfig,
      });

      res = res.replace(/^var\s/, 'window.');

      fs.ensureDirSync(`${process.env.HOME}/.matman`);

      fs.writeFileSync(`${process.env.HOME}/.matman/temp.js`, res);

      this.nightmare.inject('js', `${process.env.HOME}/.matman/temp.js`);
    } else {
      fs.ensureDirSync(`${process.env.HOME}/.matman`);

      fs.writeFileSync(
        `${process.env.HOME}/.matman/temp.js`,
        `module.exports=${this.pageDriver.evaluateFn?.toString()}`,
      );
      let res = await build(`${process.env.HOME}/.matman/temp.js`, {
        matmanConfig: this.pageDriver.matmanConfig,
      });
      res = res.replace(/var\sgetPageInfo/, 'window.getPageInfo');

      fs.writeFileSync(`${process.env.HOME}/.matman/temp.js`, res);

      this.nightmare.inject('js', `${process.env.HOME}/.matman/temp.js`);
    }

    this.emit('afterGotoPage', { url: this.pageDriver.pageUrl, nightmare: this.nightmare });
  }

  /**
   * 运行测试 case
   * @param stop 停止的步骤
   */
  async runActions(stop?: number): Promise<any[]> {
    // 循环处理多个 action
    const result: any[] = [];
    // 触发开始事件
    this.emit('beforeRunActions', { index: 0, result: result });

    let i = 0;
    const actionList = this.pageDriver?.actionList as ((n: Nightmare) => Nightmare)[];
    const length = actionList.length;

    for (i; i < length; i++) {
      // 停止在某一步
      if (stop && i > stop) {
        break;
      }

      // 开始执行 action
      this.emit('beforeRunCase', { index: i, result: result });

      // 执行 action
      if (!this.nightmare) {
        throw new Error('nightmare must be defined');
      }
      let curRun = actionList[i](this.nightmare);

      // 保存屏幕截图
      if (this.pageDriver?.screenshotConfig) {
        const screenshotFilePath = this.pageDriver.screenshotConfig.getPathWithId(i + 1);

        // 要保证这个目录存在，否则保存时会报错
        fs.ensureDirSync(path.dirname(screenshotFilePath));

        curRun.screenshot(screenshotFilePath, this.pageDriver.screenshotConfig.clip);
      }

      // 如果使用了记录器，则每个请求都延迟 50ms，注意是因为 network 是异步的
      // TODO 这里的处理过于粗暴，还可以优化
      if (this.globalInfo.recorder) {
        curRun = curRun.wait(50);
      }

      if (!this.pageDriver?.isRunList) {
        const t: any = await curRun.evaluate(evaluate);

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
      }

      // 结束执行 action
      this.emit('afterRunCase', { index: i, result: result });
    }

    this.emit('afterRunActions', { index: i, result: result });

    return result;
  }

  /**
   * 清理副作用
   */
  async cleanEffect(): Promise<void> {
    if (!this.nightmare) {
      throw new Error('nightmare must be defined');
    }
    // 暴露 electron 关闭时间，注意它在 nightmare.end() 之后才会触发
    if (
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.nightmare.proc &&
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.nightmare.proc.on
    ) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.nightmare.proc.on('close', (code: number) => {
        // var code = {
        //     127: 'command not found - you may not have electron installed correctly',
        //     126: 'permission problem or command is not an executable - you may not have all the necessary dependencies for electron',
        //     1: 'general error - you may need xvfb',
        //     0: 'success!'
        // }
        this.emit('onElectronClose', code);
      });
    }

    // 不关闭界面
    if (this.pageDriver?.doNotCloseBrowser || process.env.IS_IN_IDE) {
      await this.nightmare;
    } else {
      await this.nightmare.end();
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
}
