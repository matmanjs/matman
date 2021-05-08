import CacheData from './CacheData';

export default class DefinedInstanceBase {
  public cacheData: CacheData;
  public name: string;

  public constructor(name: string) {
    this.name = name;

    this.cacheData = new CacheData;
  }
}
