import { WhistleRule } from 'whistle-sdk';
import { MaterialBase, requireModule } from 'matman-plugin-core';
import { CacheData } from 'matman-core';
import PluginApp from './PluginApp';

interface PluginAppMaterialOpts {
  rootPath: string;
  setup?: (plugin: PluginApp) => Promise<void>;
  getWhistleRules?: (port?: number) => string | string[];
}

export default class PluginAppMaterial extends MaterialBase {
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
  public getWhistleRulesCall?: (port?: number) => string | string[];

  public constructor(filename: string, opts: PluginAppMaterialOpts, name?: string) {
    super('PluginAppMaterial', filename, name);

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
    let rules;

    if (typeof this.getWhistleRulesCall === 'function') {
      rules = this.getWhistleRulesCall(cacheData?.getCacheItem('port') as number);
    }

    if (!rules) {
      return null;
    }

    return new WhistleRule('prod', rules);
  }
}

export function getPluginAppMaterial(materialFullPath: string): PluginAppMaterial | null {
  try {
    const requiredResult = requireModule(materialFullPath);
    const result = (typeof requiredResult === 'function') ? requiredResult() : requiredResult;

    return result as PluginAppMaterial;
  } catch (err) {
    console.error('getPluginAppMaterial catch err', materialFullPath, err);

    return null;
  }
}
