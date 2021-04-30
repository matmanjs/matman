import {
  IMatmanResultQueueHandler,
  IMatmanResultQueueItem,
  IMatmanResultQueueItemPuppeteerConsole,
  IMatmanResultQueueItemPuppeteerNetwork,
  IResourceType,
} from '../typings/matmanResult';
import { RUNNER_NAME } from '../config';
import { isURLMatch } from '../util/url';

interface IMatmanResultObj {
  runnerName?: string;
  data?: unknown[];
  dataIndexMap?: {
    [key: string]: number;
  };
  globalInfo?: {
    recorder?: {
      queue: IMatmanResultQueueItem[];
      allRequestUrl: string[];
    };
  };
}

export default class MatmanResult {
  public runnerName: string;

  public data: unknown[];

  public globalInfo: {
    recorder?: {
      queue: IMatmanResultQueueItem[];
      allRequestUrl: string[];
    };

    isExistCoverageReport?: boolean;
  };

  private readonly dataIndexMap: {
    [key: string]: number;
  };

  private readonly queueHandler: null | IMatmanResultQueueHandler;

  public constructor(result: IMatmanResultObj) {
    this.runnerName = result.runnerName || 'unknown';

    /**
     * 从页面获得的数据
     * @type {Array}
     */
    this.data = result.data || [];

    /**
     * 网络请求和浏览器事件等信息
     * @type {Object}
     */
    this.globalInfo = result.globalInfo || {};

    /**
     * actionName 和数据映射表
     * @type {Object}
     */
    this.dataIndexMap = result.dataIndexMap || {};

    /**
     * 处理队列中的数据
     * @type {NightmareQueueHandler}
     */
    this.queueHandler = this.getQueueHandler();
  }

  public getQueueHandler(): null | PuppeteerQueueHandler {
    if (!this.globalInfo.recorder) {
      return null;
    }

    if (this.runnerName === RUNNER_NAME.PUPPETEER) {
      return new PuppeteerQueueHandler(this.getQueue(), this.globalInfo.recorder.allRequestUrl);
    }

    return null;
  }

  public toString(): string {
    // 移除 queueHandler ，因为会与 globalInfo 中的数据重复
    return JSON.stringify({
      runnerName: this.runnerName,
      data: this.data,
      dataIndexMap: this.dataIndexMap,
      globalInfo: this.globalInfo,
    });
  }

  /**
   * 通过测试动作名字获得数据
   *
   * @param {String | Number} actionName 测试动作名字，可以是自定义的名字，也可以是数组索引
   * @return {Object}
   */
  public get(actionName: string | number): unknown {
    if (typeof actionName === 'number') {
      return this.data[actionName];
    }
    const i = this.dataIndexMap[actionName];
    return this.data[i];
  }

  /**
   * 获得捕获到的请求队列
   *
   * @return {Array}
   */
  public getQueue(): IMatmanResultQueueItem[] {
    if (this.globalInfo.recorder?.queue) {
      return this.globalInfo.recorder.queue;
    }

    return [];
  }

  /**
   * 从结果队列中过滤出网络请求
   *
   * @param {IResourceType} [resourceType] 资源类型
   * @return {Array}
   */
  public getNetwork(resourceType?: IResourceType): IMatmanResultQueueItem[] {
    return this.queueHandler?.getNetwork(resourceType) || [];
  }

  /**
   * 是否存在某个网络请求
   *
   * @param {String} partialURL 用于匹配的部分url
   * @param {Object} [query] 请求携带的 query 参数
   * @param {String} [resourceType] 资源类型
   * @param {Number} [status] 状态码
   * @return {Boolean}
   */
  public isExistInNetwork(
    partialURL: string,
    query?: { [key: string]: any },
    resourceType?: IResourceType,
    status?: number,
  ): boolean {
    return this.queueHandler?.isExistInNetwork(partialURL, query, resourceType, status) || false;
  }

  /**
   * 是否存在某个页面
   *
   * @param {String} partialURL 用于匹配的部分url
   * @param {Object} [query] 请求携带的 query 参数
   * @param {Number} [status] 状态码
   * @return {Boolean}
   */
  public isExistPage(partialURL: string, query?: { [key: string]: any }, status?: number): boolean {
    return this.queueHandler?.isExistPage(partialURL, query, status) || false;
  }

  /**
   * 是否存在某个 xhr 请求
   *
   * @param {String} partialURL 用于匹配的部分url
   * @param {Object} [query] 请求携带的 query 参数
   * @param {Number} [status] 状态码
   * @return {Boolean}
   */
  public isExistXHR(partialURL: string, query?: { [key: string]: any }, status?: number): boolean {
    return this.queueHandler?.isExistXHR(partialURL, query, status) || false;
  }

  /**
   * 是否存在某个 image 请求
   *
   * @param {String} partialURL 用于匹配的部分url
   * @param {Object} [query] 请求携带的 query 参数
   * @param {Number} [status] 状态码
   * @return {Boolean}
   */
  public isExistImage(
    partialURL: string,
    query?: { [key: string]: any },
    status?: number,
  ): boolean {
    return this.queueHandler?.isExistImage(partialURL, query, status) || false;
  }

  /**
   * 是否存在某个 stylesheet 请求
   *
   * @param {String} partialURL 用于匹配的部分url
   * @param {Object} [query] 请求携带的 query 参数
   * @param {Number} [status] 状态码
   * @return {Boolean}
   */
  public isExistStylesheet(
    partialURL: string,
    query?: { [key: string]: any },
    status?: number,
  ): boolean {
    return this.queueHandler?.isExistStylesheet(partialURL, query, status) || false;
  }

  /**
   * 是否存在某个 script 请求
   *
   * @param {String} partialURL 用于匹配的部分url
   * @param {Object} [query] 请求携带的 query 参数
   * @param {Number} [status] 状态码
   * @return {Boolean}
   */
  public isExistScript(
    partialURL: string,
    query?: { [key: string]: any },
    status?: number,
  ): boolean {
    return this.queueHandler?.isExistScript(partialURL, query, status) || false;
  }

  /**
   * 是否存在某个 jsbridge 的调用
   *
   * @param {String} partialURL 用于匹配的部分url
   * @param {Object} [query] 请求携带的 query 参数
   * @return {Boolean}
   */
  public isExistJSBridge(partialURL: string, query?: { [key: string]: any }): boolean {
    return this.queueHandler?.isExistJSBridge(partialURL, query) || false;
  }

  /**
   * 是否存在某一条 console 记录
   *
   * @param {String} partialText 待匹配的文本
   * @param {String} [type] 类型，例如 console.log，则 type=log
   * @param {Boolean} [isFullMatch] 是否将 partialText 作为全匹配
   * @returns {Boolean}
   */
  public isExistConsole(
    partialText: string | RegExp,
    type?: string,
    isFullMatch?: boolean,
  ): boolean {
    return this.queueHandler?.isExistConsole(partialText, type, isFullMatch) || false;
  }
}

class PuppeteerQueueHandler implements IMatmanResultQueueHandler {
  public queue: IMatmanResultQueueItemPuppeteerNetwork[] | IMatmanResultQueueItemPuppeteerConsole[];
  public allRequestUrl: string[];

  public constructor(queue: IMatmanResultQueueItem[], allRequestUrl?: string[]) {
    /**
     * 从页面获得的数据
     * @type {Array}
     */
    this.queue = queue as
      | IMatmanResultQueueItemPuppeteerNetwork[]
      | IMatmanResultQueueItemPuppeteerConsole[];

    this.allRequestUrl = allRequestUrl || [];
  }

  /**
   * 从结果队列中过滤出网络请求
   *
   * @param {IResourceType} [resourceType] 资源类型
   * @return {Array}
   */
  public getNetwork(resourceType?: IResourceType): IMatmanResultQueueItemPuppeteerNetwork[] {
    const queue = this.queue as IMatmanResultQueueItemPuppeteerNetwork[];

    return queue.filter((item) => {
      const checkEventName = item.eventName === 'network';

      // 要么不传递，要么传递了就一定是指定值
      const checkResourceType =        !resourceType || (resourceType && item.resourceType === resourceType);

      return checkEventName && checkResourceType;
    });
  }

  /**
   * 从结果队列中过滤出 console log
   *
   * @returns {Array}
   */
  public getConsole(): IMatmanResultQueueItemPuppeteerConsole[] {
    const queue = this.queue as IMatmanResultQueueItemPuppeteerConsole[];

    return queue.filter(item => item.eventName === 'console');
  }

  /**
   * 是否存在某个网络请求
   *
   * @param {String} partialURL 用于匹配的部分url
   * @param {Object} [query] 请求携带的 query 参数
   * @param {String} [resourceType] 资源类型
   * @param {Number} [status] 状态码
   * @return {Boolean}
   */
  public isExistInNetwork(
    partialURL: string,
    query?: { [key: string]: any },
    resourceType?: IResourceType,
    status?: number,
  ): boolean {
    const queue = this.getNetwork(resourceType);

    let result = false;

    // 只要找到其中一个匹配即可返回
    for (let i = 0; i < queue.length; i++) {
      const queueItem = queue[i];
      const method = (queueItem.method || 'GET').toUpperCase();

      if (method === 'POST') {
        // POST 请求
        try {
          // 如果没有匹配到链接则执行下一个
          if (!isURLMatch(queueItem.url, partialURL, {})) {
            continue;
          }

          // 检查请求参数，注意 POST 请求参数在 request.postData 中，且为字符串
          if (query && typeof query === 'object') {
            const postData = JSON.parse(queueItem.request?.postData || '');
            let isNotMatch = false;

            Object.keys(query).forEach((queryKey: string) => {
              if (query[queryKey] !== postData[queryKey]) {
                isNotMatch = true;
              }
            });

            if (isNotMatch) {
              continue;
            }
          }
        } catch (e) {
          continue;
        }
      } else {
        // GET 请求

        // 如果没有匹配到链接则执行下一个
        if (!isURLMatch(queueItem.url, partialURL, query)) {
          continue;
        }
      }

      // 如果匹配了链接，但未匹配 status，也算失败
      if (status && queueItem.response.status !== status) {
        continue;
      }

      result = true;
      break;
    }

    return result;
  }

  /**
   * 是否存在某个页面
   *
   * @param {String} partialURL 用于匹配的部分url
   * @param {Object} [query] 请求携带的 query 参数
   * @param {Number} [status] 状态码
   * @return {Boolean}
   */
  public isExistPage(partialURL: string, query?: { [key: string]: any }, status?: number): boolean {
    return this.isExistInNetwork(partialURL, query, 'document', status);
  }

  /**
   * 是否存在某个 xhr 请求
   *
   * @param {String} partialURL 用于匹配的部分url
   * @param {Object} [query] 请求携带的 query 参数
   * @param {Number} [status] 状态码
   * @return {Boolean}
   */
  public isExistXHR(partialURL: string, query?: { [key: string]: any }, status?: number): boolean {
    return (
      this.isExistInNetwork(partialURL, query, 'xhr', status)
      || this.isExistInNetwork(partialURL, query, 'fetch', status)
    );
  }

  /**
   * 是否存在某个 image 请求
   *
   * @param {String} partialURL 用于匹配的部分url
   * @param {Object} [query] 请求携带的 query 参数
   * @param {Number} [status] 状态码
   * @return {Boolean}
   */
  public isExistImage(
    partialURL: string,
    query?: { [key: string]: any },
    status?: number,
  ): boolean {
    return this.isExistInNetwork(partialURL, query, 'image', status);
  }

  /**
   * 是否存在某个 stylesheet 请求
   *
   * @param {String} partialURL 用于匹配的部分url
   * @param {Object} [query] 请求携带的 query 参数
   * @param {Number} [status] 状态码
   * @return {Boolean}
   */
  public isExistStylesheet(
    partialURL: string,
    query?: { [key: string]: any },
    status?: number,
  ): boolean {
    return this.isExistInNetwork(partialURL, query, 'stylesheet', status);
  }

  /**
   * 是否存在某个 script 请求
   *
   * @param {String} partialURL 用于匹配的部分url
   * @param {Object} [query] 请求携带的 query 参数
   * @param {Number} [status] 状态码
   * @return {Boolean}
   */
  public isExistScript(
    partialURL: string,
    query?: { [key: string]: any },
    status?: number,
  ): boolean {
    return this.isExistInNetwork(partialURL, query, 'script', status);
  }

  /**
   * 是否存在某个 jsbridge 的调用
   *
   * @param {String} partialURL 用于匹配的部分url
   * @param {Object} [query] 请求携带的 query 参数
   * @return {Boolean}
   */
  public isExistJSBridge(partialURL: string, query?: { [key: string]: any }): boolean {
    const queue = this.allRequestUrl || [];

    let result = false;

    // 只要找到其中一个匹配即可返回
    for (let i = 0; i < queue.length; i++) {
      const queueItem = queue[i];

      // 如果没有匹配到链接则执行下一个
      if (!isURLMatch(queueItem, partialURL, query)) {
        continue;
      }

      result = true;
      break;
    }

    return result;
  }

  /**
   * 是否存在某一条 console 记录
   *
   * @param {String} partialText 待匹配的文本
   * @param {String} [type] 类型，例如 console.log，则 type=log
   * @param {Boolean} [isFullMatch] 是否将 partialText 作为全匹配
   * @returns {Boolean}
   */
  public isExistConsole(
    partialText: string | RegExp,
    type?: string,
    isFullMatch?: boolean,
  ): boolean {
    let queue = this.getConsole();
    // 是否过滤 console 的类型
    if (type) {
      queue = queue.filter(item => item.type === type);
    }

    // string 类型时完全匹配
    if (typeof partialText === 'string') {
      for (let i = 0; i < queue.length; ++i) {
        if (queue[i].text === partialText) {
          return true;
        }
      }
    }

    if (partialText instanceof RegExp) {
      for (let i = 0; i < queue.length; ++i) {
        if (partialText.test(queue[i].text)) {
          return true;
        }
      }
    } else {
      // partialText 有可能为 number 等，因此要转义
      const checkText = `${partialText}`;

      for (let i = 0; i < queue.length; ++i) {
        const consoleText = `${queue[i].text}`;
        if (
          (isFullMatch && consoleText === checkText)
          || (!isFullMatch && consoleText.indexOf(checkText) > -1)
        ) {
          return true;
        }
      }
    }

    return false;
  }
}
