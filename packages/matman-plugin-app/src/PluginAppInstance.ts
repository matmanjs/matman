import path from 'path';
import { WhistleRule } from 'whistle-sdk';
import { DefinedInstanceBase } from 'matman-plugin-core';
import { CacheData, E2ERunner } from 'matman-core';
import PluginApp from './PluginApp';

interface DefinedInstanceOpts {
  rootPath: string;
  setup?: (plugin: PluginApp) => Promise<void>;
  getWhistleRules?: () => string | string[];
}

const globalAny: any = global;

export default class PluginAppInstance extends DefinedInstanceBase {
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
  public getWhistleRule(cacheData?: CacheData): WhistleRule | null {
    if (!cacheData) {
      console.log('TODO 还要处理下使用端口的情况');
    }

    let rules;

    if (typeof this.getWhistleRulesCall === 'function') {
      rules = this.getWhistleRulesCall.call(this);
    }

    if (!rules) {
      return null;
    }

    return new WhistleRule('prod', rules);
  }
}


export function getPluginAppInstance(definedInstanceDir: string, activeInstance: string): PluginAppInstance | null {
  if (!globalAny.matmanE2ERunner) {
    return null;
  }

  const e2eRunner = globalAny.matmanE2ERunner as E2ERunner;

  const targetActiveInstance = path.join(definedInstanceDir, activeInstance);
  const activeInstanceFullPath = path.resolve(e2eRunner.matmanConfig.matmanRootPath, targetActiveInstance);

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require(activeInstanceFullPath)() as PluginAppInstance;
}
