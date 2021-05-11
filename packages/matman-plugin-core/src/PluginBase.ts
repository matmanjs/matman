import { CacheData, IPluginBase } from 'matman-core';

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
  public async setup(): Promise<void> {
    // 例如 build 项目、启动代理、启动 mock server 等
  }

  /**
   * 执行自动化测试
   */
  public async runTest(): Promise<void>  {
    // 例如 run test
  }

  /**
   * 自动化测试之后执行
   */
  public async teardown(): Promise<void>  {
    // 例如清理工作、处理测试产物等
  }

  public setSeqId(seqId: string): void  {
    this.seqId = seqId;
  }
}
