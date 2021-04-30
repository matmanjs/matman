import { DefinedInstanceBase } from 'matman-plugin-core';

interface DefinedInstanceOpts {
  rootPath: string;
  setup?: (port?: number) => Promise<void>;

  getWhistleRule?: (port?: number) => Promise<void>;
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

  public constructor(opts: DefinedInstanceOpts) {
    super();

    this.rootPath = opts.rootPath;
    this.setupCall = opts.setup;
  }

  /**
   * 启动自动化测试之前执行的方法
   */
  public async setup(): Promise<void> {
    if (typeof this.setupCall === 'function') {
      await this.setupCall.call(this);
    }
  }
}
