import path from 'path';
import {EventEmitter} from 'events';
import fs from 'fs-extra';
import Nightmare from 'nightmare';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {getNightmarePlus, WebEventRecorder} from 'nightmare-handler';
import {Master} from './Master';
import PageDriver, {NightmareOpts} from './PageDriver';
import {getMainUrl, evaluate} from '../util/masterUtils';

export default class NightmareMaster extends EventEmitter implements Master {
  pageDriver: PageDriver;
  globalInfoRecorderKey: string;
  nightmareConfig: NightmareOpts;
  nightmare: null | Nightmare;
  nightmareRun: null | Nightmare;
  globalInfo: {[key: string]: any};

  /**
   * 构造函数
   *
   * @param {PageDriver} pageDriver
   */
  constructor(pageDriver: PageDriver) {
    // 基类构造函数
    super();
    this.pageDriver = pageDriver;
    // 初始化配置
    this.nightmareConfig = this.pageDriver.nightmareConfig;

    // 是否使用记录器记录整个请求队列
    // 如果为 true，则可以从 this.globalInfo.recorder 中获取，
    // 如果为 字符串，则可以从 this.globalInfo[xxx] 中获取，
    this.globalInfoRecorderKey = (function (useRecorder) {
      if (!useRecorder) {
        return '';
      }

      return typeof useRecorder === 'boolean' ? 'recorder' : useRecorder + '';
    })(this.pageDriver.useRecorder);

    // nightmare 对象
    this.nightmare = null;
    this.nightmareRun = null;

    // this.mockstarQuery = opts.mockstarQuery || null;

    // 测试覆盖率
    // this.coverageConfig = opts.coverageConfig;

    // 存储网络请求和浏览器事件等信息
    this.globalInfo = {};
  }

  /**
   * 得到 nightmare 的配置
   */
  getConfig(): void {
    // 触发开始事件
    this.emit('beforeGetNightmareConfig');

    // 如果设置了 show ，则同步打开开发者工具面板
    if (this.nightmareConfig.show) {
      // https://www.npmjs.com/package/nightmare#opendevtools
      this.nightmareConfig.openDevTools = {
        mode: 'detach',
      };
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

    // 如果传递给 evaluate 的是一个本地绝对路径文件，则需要设置 preload
    if (typeof this.pageDriver.nightmareEvaluateFn === 'string') {
      this.nightmareConfig.webPreferences = {
        // 用例过多且频繁启动测试时可能会存在失败的场景 #154
        partition: 'nopersist',
        preload: this.pageDriver.nightmareEvaluateFn,
      };
    }

    // 触发时间 广播配置
    this.emit('afterGetNightmareConfig', this.nightmareConfig);
  }

  /**
   * 得到 nightmare 的一个实例
   * 并初始化一些行为
   */
  getNewInstance(): void {
    this.emit('beforeGetNewNightmare');
    // 创建 nightmare 对象，注意使用扩展的 NightmarePlus ，而不是原生的 Nightmare
    const NightmarePlus = getNightmarePlus();
    this.nightmare = NightmarePlus(this.nightmareConfig);

    // 钩子事件：创建完成之后，可能会有一些自己的处理
    this.emit('afterGetNewNightmare', this);

    // 初始化行为
    this.emit('beforeInitNightmareRun', this.nightmare);

    // 使用记录器，记录网络请求和浏览器事件等
    if (this.globalInfoRecorderKey) {
      this.globalInfo[this.globalInfoRecorderKey] = new WebEventRecorder(this.nightmare);
    }

    if (!this.nightmare) {
      throw new Error('nightmare must be defined');
    }
    // 初始化一些行为
    this.nightmareRun = this.nightmare
      .header('x-mat-from', 'nightmare')
      .header('x-mat-timestamp', Date.now() + '');

    // 设置设备
    if (this.pageDriver.deviceConfig) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.nightmareRun = this.nightmareRun.exDevice(this.pageDriver.deviceConfig.name, {
        UA: this.pageDriver.deviceConfig.UA,
        width: this.pageDriver.deviceConfig.width,
        height: this.pageDriver.deviceConfig.height,
      });
    }

    // 设置 cookie
    if (this.pageDriver.cookies) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.nightmareRun = this.nightmareRun.exCookies(
        this.pageDriver.cookies,
        getMainUrl(this.pageDriver.pageUrl),
      );
    }

    // 如果有设置符合要求的 matman 服务设置，则还需要额外处理一下
    if (
      this.pageDriver.mockstarQuery &&
      typeof this.pageDriver.mockstarQuery.appendToUrl === 'function'
    ) {
      this.pageDriver.pageUrl = this.pageDriver.mockstarQuery.appendToUrl(this.pageDriver.pageUrl);
    }

    this.emit('afterInitNightmareRun', {
      nightmare: this.nightmare,
      nightmareRun: this.nightmareRun,
    });
  }

  /**
   * 打开界面
   */
  gotoPage(): void {
    this.emit('beforeGotoPage', this.pageDriver.pageUrl);

    if (!this.nightmareRun) {
      throw new Error('nightmareRun must be defined');
    }
    this.nightmareRun = this.nightmareRun.goto(this.pageDriver.pageUrl);

    // 如果指定了 wait，则会传递给 nightmare 处理，具体使用方法可以参考：
    // https://github.com/segmentio/nightmare#waitms
    // https://github.com/segmentio/nightmare#waitselector
    // https://github.com/segmentio/nightmare#waitfn-arg1-arg2
    if (typeof this.pageDriver.nightmareWaitFn !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.nightmareRun = this.nightmareRun.wait(
        this.pageDriver.nightmareWaitFn,
        ...this.pageDriver.nightmareWaitFnArgs,
      );
    }

    this.emit('afterGotoPage', {url: this.pageDriver.pageUrl, nightmareRun: this.nightmareRun});
  }

  /**
   * 运行测试 case
   * @param stop 停止的步骤
   */
  async runActions(stop?: number): Promise<any[]> {
    // 循环处理多个 action
    const result: any[] = [];
    // 触发开始事件
    this.emit('beforeRunActions', {index: 0, result: result});

    let i = 0;
    const actionList = this.pageDriver.actionList as ((n: Nightmare) => Nightmare)[];
    const length = actionList.length;

    for (i; i < length; i++) {
      // 停止在某一步
      if (stop && i > stop) {
        break;
      }

      // 开始执行 action
      this.emit('beforeRunCase', {index: i, result: result});

      // 执行 action
      if (!this.nightmareRun) {
        throw new Error('nightmareRun must be defined');
      }
      let curRun = actionList[i](this.nightmareRun);

      // 保存屏幕截图
      if (this.pageDriver.screenshotConfig) {
        const screenshotFilePath = this.pageDriver.screenshotConfig.getPathWithId(i + 1);

        // 要保证这个目录存在，否则保存时会报错
        fs.ensureDirSync(path.dirname(screenshotFilePath));

        curRun.screenshot(screenshotFilePath, this.pageDriver.screenshotConfig.clip);
      }

      // 如果使用了记录器，则每个请求都延迟 50ms，注意是因为 network 是异步的
      // TODO 这里的处理过于粗暴，还可以优化
      if (this.globalInfoRecorderKey) {
        curRun = curRun.wait(50);
      }

      let t: any;
      if (typeof this.pageDriver.nightmareEvaluateFn === 'function') {
        t = await curRun.evaluate(
          this.pageDriver.nightmareEvaluateFn,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          ...this.pageDriver.nightmareEvaluateFnArgs,
        );
      } else {
        t = await curRun.evaluate(evaluate);
      }

      // 覆盖率数据
      if (t.__coverage__ && this.pageDriver.coverageConfig) {
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

  /**
   * 清理副作用
   */
  async cleanEffect(): Promise<void> {
    if (!this.nightmareRun) {
      throw new Error('nightmareRun must be defined');
    }
    // 暴露 electron 关闭时间，注意它在 nightmareRun.end() 之后才会触发
    if (
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.nightmareRun.proc &&
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.nightmareRun.proc.on
    ) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.nightmareRun.proc.on('close', (code: number) => {
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
    if (this.pageDriver.doNotCloseBrowser) {
      await this.nightmareRun;
    } else {
      await this.nightmareRun.end();
    }
  }

  async getResult() {
    this.getConfig();

    this.getNewInstance();

    this.gotoPage();

    const result = await this.runActions();

    this.cleanEffect();

    return {
      data: result,
      _dataIndexMap: this.pageDriver._dataIndexMap,
      globalInfo: this.globalInfo,
    };
  }
}
