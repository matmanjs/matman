import fse from 'fs-extra';
import { PluginBase } from 'matman-plugin-core';

import { getSeqId } from './util';

// interface ProcessCmd {
//   originalCmd: string;
//   processKey: string;
//   cmd: string;
//   t: number;
// }

interface E2ERunnerConfig {
  outputPath: string;
  workspacePath: string;
  npmRunner?: string;
  isDev?: boolean;
  isRunUnitTest?: boolean;
  isRunE2ETest?: boolean;
}

// type StringObject<T> = { [key: string]: T };

export default class E2ERunner {
  public outputPath: string;
  public workspacePath: string;
  public seqId: string;
  public isDev: boolean;
  public npmRunner?: string;
  public plugins: PluginBase[];
  // private cacheData: StringObject<unknown>;
  // private readonly cacheProcessArr: ProcessCmd[];
  // private readonly startTime: number;

  public constructor(config: E2ERunnerConfig) {
    if (!config.outputPath) {
      throw new Error(`[DWTRunner] config.outputPath is not exist: ${config.outputPath}`);
    }

    // 一旦设置了 config.workspacePath，则必须是存在的路径
    if (!config.workspacePath || !fse.existsSync(config.workspacePath)) {
      throw new Error(`config.workspacePath is not exist! config.workspacePath=${config.workspacePath}`);
    }

    // 测试产物输出目录
    this.outputPath = config.outputPath;

    // 工作区间
    this.workspacePath = config.workspacePath;

    // 是否为开发者模式
    this.isDev = !!config.isDev;

    // 自动生成的唯一ID，用于区别不同批次的流程，
    // 尤其是有多个流程在同一个测试机中运行的时候，如果不做区分，则可能会有相互影响
    // 注意不要出现等号，否则whistle里面会有问题
    this.seqId = getSeqId(this.outputPath, this.isDev);

    // // 缓存数据
    // this.cacheData = {
    //   outputPath: this.outputPath,
    // };

    // // 缓存进程，方便后续进行清理
    // this.cacheProcessArr = [];

    // // 初始化开始时间，最终用于计算执行时长
    // this.startTime = Date.now();

    this.plugins = [];
  }

  public addPlugin(plugin: PluginBase) {
    this.plugins.push(plugin);
  }

  public async setup() {
    // 启动构建
    // 启动 mockstar
    // 启动 whistle
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let index = 0; index < this.plugins.length; index++) {
      const plugin = this.plugins[index];

      await plugin.setup();
    }
  }


  public async runTest() {

  }

  public async teardown() {
    // 启动构建
    // 启动 mockstar
    // 启动 whistle

    // [].forEach setup
  }
}
