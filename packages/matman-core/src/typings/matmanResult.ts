export interface NetworkType {
  eventName: string;
  args: any[];
}

/**
 * 数据爬虫执行结果
 * @member data 截获的数据
 * @member _dataIndexMap 映射信息
 * @member globalInfo 请求信息等
 */
export interface MatmanResult {
  data: unknown[];
  _dataIndexMap: {
    [key: string]: number;
  };
  globalInfo: {
    [key: string]: {
      queue: NetworkType[];
    };
  };
}
