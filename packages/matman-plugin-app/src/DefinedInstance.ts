interface DefinedInstanceOpts {
  rootPath: string;
  setup?: (port?: number) => void;
}

type ICacheValue = string | number | boolean;

interface ICacheData  {
  [key: string]: ICacheValue;
}

export default class DefinedInstance {
  /**
   * 被测应用的根目录
   */
  public rootPath: string;

  /**
   * 缓存信息
   */
  private cacheData: ICacheData;


  /**
   * @param opts {DefinedInstanceOpts}
   */
  public constructor(opts: DefinedInstanceOpts) {
    this.rootPath = opts.rootPath;

    this.cacheData = {};
  }

  public setup() {

  }

  /**
   * 设置缓存信息
   */
  public setCacheItem(key: string, value: ICacheValue): void {
    this.cacheData[key] = value;
  }

  /**
   * 获取缓存信息
   */
  public getCacheItem(key: string): ICacheValue {
    return this.cacheData[key];
  }

  /**
   * 获取缓存信息
   */
  public getCache(key?: string): ICacheData| ICacheValue {
    return key ? this.cacheData[key] : this.cacheData;
  }
}
