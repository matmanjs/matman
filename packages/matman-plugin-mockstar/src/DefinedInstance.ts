import { DefinedInstanceBase, CacheData } from 'matman-plugin-core';

interface IQueryMap{
  [key: string]: string
}

interface DefinedInstanceOpts {
  queryMap: IQueryMap;
}

export default class DefinedInstance extends DefinedInstanceBase {
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
  public getWhistleRules(cacheData: CacheData): string | string[] {
    const port = cacheData.getCacheItem('port');

    // TODO 应该从 queryMap 中自动获取
    return [
      `/(.*)/cgi-bin/a/b/verify-identity(.*)/ 127.0.0.1:${port}`,
      `/(.*)/cgi-bin/a/b/verify-phone(.*)/ 127.0.0.1:${port}`,
    ];
  }
}
