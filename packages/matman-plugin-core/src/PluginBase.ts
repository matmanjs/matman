import { CacheData, IPluginBase, Pipeline } from 'matman-core';

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
   * 初始化插件
   */
  public initPlugin(pipeline: Pipeline): void {
    // 例如将相对路径修改为绝对路径等
    if (process.env.CONSOLE_E2E_RUNNER) {
      console.log(pipeline);
    }

    globalAny.matmanPipeline = pipeline;
  }

  /**
   * 自动化测试之前执行
   */
  public async setup(pipeline: Pipeline): Promise<void> {
    // 例如 build 项目、启动代理、启动 mock server 等
    if (process.env.CONSOLE_E2E_RUNNER) {
      console.log(pipeline);
    }

    globalAny.matmanPipeline = pipeline;
  }

  /**
   * 执行自动化测试
   */
  public async runTest(pipeline: Pipeline): Promise<void>  {
    // 例如 run test
    if (process.env.CONSOLE_E2E_RUNNER) {
      console.log(pipeline);
    }

    globalAny.matmanPipeline = pipeline;
  }

  /**
   * 自动化测试之后执行
   */
  public async teardown(pipeline: Pipeline): Promise<void>  {
    // 例如清理工作、处理测试产物等
    if (process.env.CONSOLE_E2E_RUNNER) {
      console.log(pipeline);
    }

    globalAny.matmanPipeline = pipeline;
  }

  public setSeqId(seqId: string): void  {
    this.seqId = seqId;
  }
}
