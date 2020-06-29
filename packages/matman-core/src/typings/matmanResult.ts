export interface MatmanResultQueueItemNightmare {
  runnerName: string;
  eventName: string;
  args: any[];
}

export interface MatmanResultQueueItemPuppeteerNetwork {
  runnerName: string;
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

export interface MatmanResultQueueItemPuppeteerConsole {
  runnerName: string;
  eventName: string;
  type: string;
  text: string;
}

export type MatmanResultQueueItem =
  | MatmanResultQueueItemNightmare
  | MatmanResultQueueItemPuppeteerNetwork
  | MatmanResultQueueItemPuppeteerConsole;

/**
 * 数据爬虫执行结果
 * @member data 截获的数据
 * @member dataIndexMap 映射信息
 * @member globalInfo 请求信息等
 */
export interface MatmanResult {
  data: unknown[];
  dataIndexMap: {
    [key: string]: number;
  };
  runnerName: string;
  globalInfo: {
    recorder?: {
      queue: MatmanResultQueueItem[];
    };
  };
}

interface QueryOpts {
  [key: string]: string | number | boolean;
}

/**
 * nightmare 资源类型的枚举，详见 nightmare-handler 组件中的 RESOURCE_TYPE
 */
type NightmareResourceType =
  | 'mainFrame'
  | 'subFrame'
  | 'stylesheet'
  | 'script'
  | 'image'
  | 'object'
  | 'xhr'
  | 'other';

/**
 * puppeteer 资源类型的枚举
 * https://github.com/puppeteer/puppeteer/blob/v4.0.0/docs/api.md#httprequestresourcetype
 */
type PuppeteerResourceType =
  | 'document'
  | 'stylesheet'
  | 'image'
  | 'media'
  | 'font'
  | 'script'
  | 'texttrack'
  | 'xhr'
  | 'fetch'
  | 'eventsource'
  | 'websocket'
  | 'manifest'
  | 'other';

export type ResourceType = PuppeteerResourceType | NightmareResourceType;

export interface MatmanResultQueueHandler {
  queue: MatmanResultQueueItem[];

  /**
   * 从结果队列中过滤出网络请求
   *
   * @param {ResourceType} [resourceType] 资源类型
   * @return {Array}
   * @author helinjiang
   */
  getNetwork(resourceType?: ResourceType): MatmanResultQueueItem[];

  /**
   * 是否存在某个网络请求
   *
   * @param {String} partialURL 用于匹配的部分url
   * @param {QueryOpts} [query] 请求携带的 query 参数
   * @param {ResourceType} [resourceType] 资源类型
   * @param {Number} [status] 状态码
   * @return {Boolean}
   * @author helinjiang
   */
  isExistInNetwork(
    partialURL: string,
    query?: QueryOpts,
    resourceType?: ResourceType,
    status?: number,
  ): boolean;

  /**
   * 是否存在某个页面
   *
   * @param {String} partialURL 用于匹配的部分url
   * @param {QueryOpts} [query] 请求携带的 query 参数
   * @param {Number} [status] 状态码
   * @return {Boolean}
   * @author helinjiang
   */
  isExistPage(partialURL: string, query?: QueryOpts, status?: number): boolean;

  /**
   * 是否存在某个 xhr 请求
   *
   * @param {String} partialURL 用于匹配的部分url
   * @param {QueryOpts} [query] 请求携带的 query 参数
   * @param {Number} [status] 状态码
   * @return {Boolean}
   * @author helinjiang
   */
  isExistXHR(partialURL: string, query?: QueryOpts, status?: number): boolean;

  /**
   * 是否存在某个 image 请求
   *
   * @param {String} partialURL 用于匹配的部分url
   * @param {QueryOpts} [query] 请求携带的 query 参数
   * @param {Number} [status] 状态码
   * @return {Boolean}
   * @author helinjiang
   */
  isExistImage(partialURL: string, query?: QueryOpts, status?: number): boolean;

  /**
   * 是否存在某个 stylesheet 请求
   *
   * @param {String} partialURL 用于匹配的部分url
   * @param {QueryOpts} [query] 请求携带的 query 参数
   * @param {Number} [status] 状态码
   * @return {Boolean}
   * @author helinjiang
   */
  isExistStylesheet(partialURL: string, query?: QueryOpts, status?: number): boolean;

  /**
   * 是否存在某个 script 请求
   *
   * @param {String} partialURL 用于匹配的部分url
   * @param {QueryOpts} [query] 请求携带的 query 参数
   * @param {Number} [status] 状态码
   * @return {Boolean}
   * @author helinjiang
   */
  isExistScript(partialURL: string, query?: QueryOpts, status?: number): boolean;

  /**
   * 是否存在某个 jsbridge 的调用
   *
   * @param {String} partialURL 用于匹配的部分url
   * @param {Object} [query] 请求携带的 query 参数
   * @return {Boolean}
   * @author helinjiang
   */
  isExistJSBridge(partialURL: string, query?: QueryOpts): boolean;
}
