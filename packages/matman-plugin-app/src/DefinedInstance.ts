import { WhistleRule } from 'matman-core';
import { DefinedInstanceBase } from 'matman-plugin-core';

interface DefinedInstanceOpts {
  rootPath: string;
  setup?: (port?: number) => Promise<void>;
  getWhistleRule?: () => Promise<WhistleRule>;
}

export default class DefinedInstance extends DefinedInstanceBase {
  /**
   * 被测应用/项目的根目录，即 package.json 的目录
   */
  public rootPath: string;

  /**
   * 启动自动化测试之前执行的方法
   */
  public setupCall?: (port?: number) => Promise<void>;


  /**
   * 获取 whistle 规则
   */
  public getWhistleRuleCall?: () => Promise<WhistleRule>;

  public constructor(opts: DefinedInstanceOpts) {
    super();

    this.rootPath = opts.rootPath;
    this.setupCall = opts.setup;
    this.getWhistleRuleCall = opts.getWhistleRule;
  }

  /**
   * 启动自动化测试之前执行的方法
   */
  public async setup(): Promise<void> {
    if (typeof this.setupCall === 'function') {
      await this.setupCall.call(this);
    }
  }

  /**
   * 获取 whistle 规则
   */
  public async getWhistleRule(): Promise<WhistleRule | null> {
    if (typeof this.getWhistleRuleCall === 'function') {
      return this.getWhistleRuleCall.call(this);
    }

    return null;
  }
}
