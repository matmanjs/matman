import { DefinedInstanceBase } from 'matman-plugin-core';
import PluginApp from './PluginApp';

interface DefinedInstanceOpts {
  rootPath: string;
  setup?: (plugin: PluginApp) => Promise<void>;
  getWhistleRules?: () => string | string[];
}

export default class DefinedInstance extends DefinedInstanceBase {
  /**
   * 被测应用/项目的根目录，即 package.json 的目录
   */
  public rootPath: string;

  /**
   * 启动自动化测试之前执行的方法
   */
  public setupCall?: (plugin: PluginApp) => Promise<void>;


  /**
   * 获取 whistle 规则
   */
  public getWhistleRulesCall?: () => string | string[];

  public constructor(opts: DefinedInstanceOpts) {
    super();

    this.rootPath = opts.rootPath;
    this.setupCall = opts.setup;
    this.getWhistleRulesCall = opts.getWhistleRules;
  }

  /**
   * 启动自动化测试之前执行的方法
   */
  public async setup(plugin: PluginApp): Promise<void> {
    if (typeof this.setupCall === 'function') {
      await this.setupCall.call(this, plugin);
    }
  }

  /**
   * 获取 whistle 规则
   */
  public getWhistleRules(): string | string[] | null{
    if (typeof this.getWhistleRulesCall === 'function') {
      return this.getWhistleRulesCall.call(this);
    }

    return null;
  }
}
