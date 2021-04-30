import CacheData from './CacheData';

export default class DefinedInstanceBase {
  public cacheData: CacheData;

  public constructor() {
    this.cacheData = new CacheData;
  }
}
