import { MaterialBase, requireModule } from 'matman-plugin-core';
import { CacheData } from 'matman-core';
import { WhistleRule } from 'whistle-sdk';

interface IQueryMap {
  [key: string]: string;
}

interface PluginMockstarMaterialOpts {
  queryMap: IQueryMap;
}

type IGetMaterialCallFn = () => PluginMockstarMaterial;
type IGetMaterialParam = PluginMockstarMaterial | IGetMaterialCallFn | string;

export default class PluginMockstarMaterial extends MaterialBase {
  public queryMap: IQueryMap;

  /**
   * 获取 whistle 规则
   */
  public getWhistleRulesCall?: () => string | string[];

  public constructor(filename: string, opts: PluginMockstarMaterialOpts, name?: string) {
    super(filename, name);

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

export function getPluginMockstarMaterial(param?: IGetMaterialParam): PluginMockstarMaterial | null {
  if (!param) {
    return null;
  }

  // 如果是字符串，则意味着是模块路径
  if (typeof param === 'string') {
    try {
      const requiredResult = requireModule(param);
      const result = (typeof requiredResult === 'function') ? requiredResult() : requiredResult;

      return result as PluginMockstarMaterial;
    } catch (err) {
      console.error('getPluginMockstarMaterial catch err', param, err);

      return null;
    }
  }

  // 如果已经是 PluginMockstarMaterial ，则直接返回
  if (param instanceof PluginMockstarMaterial) {
    return param;
  }

  // 如果是函数
  if (typeof param === 'function') {
    return param();
  }

  return null;
}
