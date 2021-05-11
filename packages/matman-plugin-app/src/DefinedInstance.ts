import { WhistleRule } from 'whistle-sdk';
import { CacheData, DefinedInstanceBase } from 'matman-plugin-core';
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

  public constructor(name: string, opts: DefinedInstanceOpts) {
    super(name);

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
  public getWhistleRule(cacheData?: CacheData): WhistleRule {
    if (!cacheData) {
      console.log('TODO 还要处理下使用端口的情况');
    }

    let rules;

    if (typeof this.getWhistleRulesCall === 'function') {
      rules = this.getWhistleRulesCall.call(this);
    }

    if (!rules) {
      return new WhistleRule('prod', ['# mockstar 代理设置失败！']);
    }

    return new WhistleRule('prod', rules);
  }
}
