export type ICacheValue = string | number | boolean | undefined | null;

export interface ICacheData  {
  [key: string]: ICacheValue;
}

export default class CacheData {
  private data: ICacheData;

  public constructor() {
    this.data = {};
  }

  /**
   * 设置缓存信息
   */
  public setCacheItem(key: string, value: ICacheValue): void {
    this.data[key] = value;
  }

  /**
   * 获取指定 key 的缓存值
   */
  public getCacheItem(key: string): ICacheValue {
    return this.data[key];
  }

  /**
   * 获取所有的缓存信息
   */
  public getCache(): ICacheData {
    return this.data;
  }

  /**
   * 清除所有缓存信息
   */
  public clear(): void {
    this.data = {};
  }
}
