interface NightmareQueueItem {
  eventName: string;
  args: any[];
}

interface PuppeteerNetworkItem {
  eventName: string;
  url: string;
  method: string;
  // https://github.com/puppeteer/puppeteer/blob/v4.0.0/docs/api.md#httprequestresourcetype
  resourceType: string;
  request: {
    headers: {
      [key: string]: string;
    };
    postData?: string;
  };
  response: {
    ok: boolean;
    status: number;
    statusText: string;
    headers: {
      [key: string]: string;
    };
    fromCache: boolean;
    body: null | {
      [key: string]: any;
    };
  };
}

interface PuppeteerConsoleItem {
  eventName: string;
  type: string;
  text: string;
}

export type MatmanResultQueueItem =
  | NightmareQueueItem
  | PuppeteerNetworkItem
  | PuppeteerConsoleItem;

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
      queue: MatmanResultQueueItem[];
    };
  };
}
