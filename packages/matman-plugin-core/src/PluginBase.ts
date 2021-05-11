import { CacheData, IPluginBase, E2ERunner } from 'matman-core';

const globalAny: any = global;
export default class PluginBase implements IPluginBase {
  /**
   * 插件名字
   */
  public name: string;

  /**
   * 缓存数据
   */
  public cacheData: CacheData;

  /**
   * 序列号
   */
  public seqId: string;

  public constructor(name: string) {
    this.name = name;

    this.cacheData = new CacheData;

    this.seqId = `${this.name}-${Math.random()}`;
  }

  /**
   * 自动化测试之前执行
   */
  public async setup(e2eRunner: E2ERunner): Promise<void> {
    // 例如 build 项目、启动代理、启动 mock server 等
    if (process.env.CONSOLE_E2E_RUNNER) {
      console.log(e2eRunner);
    }

    globalAny.matmanE2ERunner = e2eRunner;
  }

  /**
   * 执行自动化测试
   */
  public async runTest(e2eRunner: E2ERunner): Promise<void>  {
    // 例如 run test
    if (process.env.CONSOLE_E2E_RUNNER) {
      console.log(e2eRunner);
    }

    globalAny.matmanE2ERunner = e2eRunner;
  }

  /**
   * 自动化测试之后执行
   */
  public async teardown(e2eRunner: E2ERunner): Promise<void>  {
    // 例如清理工作、处理测试产物等
    if (process.env.CONSOLE_E2E_RUNNER) {
      console.log(e2eRunner);
    }

    globalAny.matmanE2ERunner = e2eRunner;
  }

  public setSeqId(seqId: string): void  {
    this.seqId = seqId;
  }
}
