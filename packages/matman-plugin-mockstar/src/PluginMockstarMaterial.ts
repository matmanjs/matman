import { MaterialBase } from 'matman-plugin-core';
import { CacheData } from 'matman-core';
import { WhistleRule } from 'whistle-sdk';

interface IQueryMap {
  [key: string]: string;
}

interface DefinedInstanceOpts {
  queryMap: IQueryMap;
}

type IGetDefinedInstanceCallFn = () => PluginMockstarMaterial;
type IRequiredModule = PluginMockstarMaterial | IGetDefinedInstanceCallFn;

export default class PluginMockstarMaterial extends MaterialBase {
  public queryMap: IQueryMap;

  /**
   * 获取 whistle 规则
   */
  public getWhistleRulesCall?: () => string | string[];

  public constructor(name: string, opts: DefinedInstanceOpts) {
    super(name);

    this.queryMap = opts.queryMap;
  }

  /**
   * 获取 whistle 规则
   */
  public getWhistleRule(cacheData?: CacheData): WhistleRule | null {
    if (!cacheData) {
      return null;
    }

    const port = cacheData.getCacheItem('port');

    // TODO 应该从 queryMap 中自动获取
    const rules = [
      `# ${JSON.stringify(this.queryMap)}`,
      `/(.*)/cgi-bin/a/b/verify-identity(.*)/ 127.0.0.1:${port}`,
      `/(.*)/cgi-bin/a/b/verify-phone(.*)/ 127.0.0.1:${port}`,
      `/(.*)/cgi-bin/a/b/get-money(.*)/ 127.0.0.1:${port}`,
    ];

    // TODO 这里的 name 需要自动生成，例如按照当前 case module 的名字来生成
    return new WhistleRule('prod', rules);
  }
}

export function getPluginMockstarMaterial(requiredModule?: IRequiredModule): PluginMockstarMaterial | null {
  if (!requiredModule) {
    return null;
  }

  // 如果模块已经是 DefinedInstance，则直接返回
  if (requiredModule instanceof PluginMockstarMaterial) {
    return requiredModule;
  }

  // 如果模块是函数
  if (typeof requiredModule === 'function') {
    return requiredModule();
  }

  return null;
}
