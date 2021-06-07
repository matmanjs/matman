export interface IMatmanResultQueueItemPuppeteerNetwork {
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

export interface IMatmanResultQueueItemPuppeteerConsole {
  eventName: string;
  type: string;
  text: string;
}

export type IMatmanResultQueueItem =
  | IMatmanResultQueueItemPuppeteerNetwork
  | IMatmanResultQueueItemPuppeteerConsole;

interface IQueryOpts {
  [key: string]: string | number | boolean;
}

/**
 * puppeteer 资源类型的枚举
 * https://github.com/puppeteer/puppeteer/blob/v4.0.0/docs/api.md#httprequestresourcetype
 */
type IPuppeteerResourceType =
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
  | 'other'
  | '';

export type IResourceType = IPuppeteerResourceType;

export interface IMatmanResultQueueHandler {
  queue: IMatmanResultQueueItem[];

  /**
   * 从结果队列中过滤出网络请求
   *
   * @param {IResourceType} [resourceType] 资源类型
   * @return {Array}
   */
  getNetwork(resourceType?: IResourceType): IMatmanResultQueueItem[];

  /**
   * 是否存在某个网络请求
   *
   * @param {String} partialURL 用于匹配的部分url
   * @param {IQueryOpts} [query] 请求携带的 query 参数
   * @param {IResourceType} [resourceType] 资源类型
   * @param {Number} [status] 状态码
   * @return {Boolean}
   */
  isExistInNetwork(
    partialURL: string,
    query?: IQueryOpts,
    resourceType?: IResourceType,
    status?: number,
  ): boolean;

  /**
   * 是否存在某个页面
   *
   * @param {String} partialURL 用于匹配的部分url
   * @param {IQueryOpts} [query] 请求携带的 query 参数
   * @param {Number} [status] 状态码
   * @return {Boolean}
   */
  isExistPage(partialURL: string, query?: IQueryOpts, status?: number): boolean;

  /**
   * 是否存在某个 xhr 请求
   *
   * @param {String} partialURL 用于匹配的部分url
   * @param {IQueryOpts} [query] 请求携带的 query 参数
   * @param {Number} [status] 状态码
   * @return {Boolean}
   */
  isExistXHR(partialURL: string, query?: IQueryOpts, status?: number): boolean;

  /**
   * 是否存在某个 image 请求
   *
   * @param {String} partialURL 用于匹配的部分url
   * @param {IQueryOpts} [query] 请求携带的 query 参数
   * @param {Number} [status] 状态码
   * @return {Boolean}
   */
  isExistImage(partialURL: string, query?: IQueryOpts, status?: number): boolean;

  /**
   * 是否存在某个 stylesheet 请求
   *
   * @param {String} partialURL 用于匹配的部分url
   * @param {IQueryOpts} [query] 请求携带的 query 参数
   * @param {Number} [status] 状态码
   * @return {Boolean}
   */
  isExistStylesheet(partialURL: string, query?: IQueryOpts, status?: number): boolean;

  /**
   * 是否存在某个 script 请求
   *
   * @param {String} partialURL 用于匹配的部分url
   * @param {IQueryOpts} [query] 请求携带的 query 参数
   * @param {Number} [status] 状态码
   * @return {Boolean}
   */
  isExistScript(partialURL: string, query?: IQueryOpts, status?: number): boolean;

  /**
   * 是否存在某个 jsbridge 的调用
   *
   * @param {String} partialURL 用于匹配的部分url
   * @param {Object} [query] 请求携带的 query 参数
   * @return {Boolean}
   */
  isExistJSBridge(partialURL: string, query?: IQueryOpts): boolean;

  /**
   * 是否存在某一条 console 记录
   *
   * @param {String | RegExp} partialText 待匹配的文本
   * @param {String} [type] 类型，例如 console.log，则 type=log
   * @param {Boolean} [isFullMatch] 是否将 partialText 作为全匹配
   * @returns {Boolean}
   */
  isExistConsole(partialText: string | RegExp, type?: string, isFullMatch?: boolean): boolean;
}
