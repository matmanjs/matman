import {
  MatmanResultQueueHandler,
  MatmanResultQueueItem,
  MatmanResultQueueItemNightmare,
  MatmanResultQueueItemPuppeteerConsole,
  MatmanResultQueueItemPuppeteerNetwork,
  ResourceType,
} from '../typings/matmanResult';

import { RUNNER_NAME } from '../config';

import { isURLMatch } from '../util/url';

interface MatmanResultObj {
  runnerName?: string;
  data?: unknown[];
  dataIndexMap?: {
    [key: string]: number;
  };
  globalInfo?: {
    recorder?: {
      queue: MatmanResultQueueItem[];
      allRequestUrl: string[];
    };
  };
}

export default class MatmanResult {
  runnerName: string;

  data: unknown[];

  globalInfo: {
    recorder?: {
      queue: MatmanResultQueueItem[];
      allRequestUrl: string[];
    };

    isExistCoverageReport?: boolean;
  };

  private readonly dataIndexMap: {
    [key: string]: number;
  };

  private readonly queueHandler: null | MatmanResultQueueHandler;

  /**
   * matman 框架执行的结果
   *
   * @param {Object} result
   * @author helinjiang
   */
  constructor(result: MatmanResultObj) {
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

  private getQueueHandler(): null | NightmareQueueHandler | PuppeteerQueueHandler {
    if (!this.globalInfo.recorder) {
      return null;
    }

    if (this.runnerName === RUNNER_NAME.NIGHTMARE) {
      return new NightmareQueueHandler(this.getQueue());
    } else if (this.runnerName === RUNNER_NAME.PUPPETEER) {
      return new PuppeteerQueueHandler(this.getQueue(), this.globalInfo.recorder.allRequestUrl);
    } else {
      return null;
    }
  }

  toString() {
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
   * @param {String || Number} actionName 测试动作名字，可以是自定义的名字，也可以是数组索引
   * @return {Object}
   * @author helinjiang
   */
  get(actionName: string | number): unknown {
    if (typeof actionName === 'number') {
      return this.data[actionName];
    } else {
      const i = this.dataIndexMap[actionName];
      return this.data[i];
    }
  }

  /**
   * 获得捕获到的请求队列
   *
   * @return {Array}
   * @author helinjiang
   */
  getQueue(): MatmanResultQueueItem[] {
    if (this.globalInfo.recorder && this.globalInfo.recorder.queue) {
      return this.globalInfo.recorder.queue;
    }

    return [];
  }

  /**
   * 从结果队列中过滤出网络请求
   *
   * @param {ResourceType} [resourceType] 资源类型
   * @return {Array}
   * @author helinjiang
   */
  getNetwork(resourceType?: ResourceType): MatmanResultQueueItem[] {
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
   * @author helinjiang
   */
  isExistInNetwork(
    partialURL: string,
    query?: { [key: string]: any },
    resourceType?: ResourceType,
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
   * @author helinjiang
   */
  isExistPage(partialURL: string, query?: { [key: string]: any }, status?: number): boolean {
    return this.queueHandler?.isExistPage(partialURL, query, status) || false;
  }

  /**
   * 是否存在某个 xhr 请求
   *
   * @param {String} partialURL 用于匹配的部分url
   * @param {Object} [query] 请求携带的 query 参数
   * @param {Number} [status] 状态码
   * @return {Boolean}
   * @author helinjiang
   */
  isExistXHR(partialURL: string, query?: { [key: string]: any }, status?: number): boolean {
    return this.queueHandler?.isExistXHR(partialURL, query, status) || false;
  }

  /**
   * 是否存在某个 image 请求
   *
   * @param {String} partialURL 用于匹配的部分url
   * @param {Object} [query] 请求携带的 query 参数
   * @param {Number} [status] 状态码
   * @return {Boolean}
   * @author helinjiang
   */
  isExistImage(partialURL: string, query?: { [key: string]: any }, status?: number): boolean {
    return this.queueHandler?.isExistImage(partialURL, query, status) || false;
  }

  /**
   * 是否存在某个 stylesheet 请求
   *
   * @param {String} partialURL 用于匹配的部分url
   * @param {Object} [query] 请求携带的 query 参数
   * @param {Number} [status] 状态码
   * @return {Boolean}
   * @author helinjiang
   */
  isExistStylesheet(partialURL: string, query?: { [key: string]: any }, status?: number): boolean {
    return this.queueHandler?.isExistStylesheet(partialURL, query, status) || false;
  }

  /**
   * 是否存在某个 script 请求
   *
   * @param {String} partialURL 用于匹配的部分url
   * @param {Object} [query] 请求携带的 query 参数
   * @param {Number} [status] 状态码
   * @return {Boolean}
   * @author helinjiang
   */
  isExistScript(partialURL: string, query?: { [key: string]: any }, status?: number): boolean {
    return this.queueHandler?.isExistScript(partialURL, query, status) || false;
  }

  /**
   * 是否存在某个 jsbridge 的调用
   *
   * @param {String} partialURL 用于匹配的部分url
   * @param {Object} [query] 请求携带的 query 参数
   * @return {Boolean}
   * @author helinjiang
   */
  isExistJSBridge(partialURL: string, query?: { [key: string]: any }): boolean {
    return this.queueHandler?.isExistJSBridge(partialURL, query) || false;
  }
}

class PuppeteerQueueHandler implements MatmanResultQueueHandler {
  queue: MatmanResultQueueItemPuppeteerNetwork[] | MatmanResultQueueItemPuppeteerConsole[];
  allRequestUrl: string[];

  constructor(queue: MatmanResultQueueItem[], allRequestUrl?: string[]) {
    /**
     * 从页面获得的数据
     * @type {Array}
     */
    this.queue = queue as
      | MatmanResultQueueItemPuppeteerNetwork[]
      | MatmanResultQueueItemPuppeteerConsole[];

    this.allRequestUrl = allRequestUrl || [];
  }

  /**
   * 从结果队列中过滤出网络请求
   *
   * @param {ResourceType} [resourceType] 资源类型
   * @return {Array}
   * @author helinjiang
   */
  getNetwork(resourceType?: ResourceType): MatmanResultQueueItemPuppeteerNetwork[] {
    const queue = this.queue as MatmanResultQueueItemPuppeteerNetwork[];

    return queue.filter(item => {
      return item.eventName === 'network';
    });
  }

  /**
   * 是否存在某个网络请求
   *
   * @param {String} partialURL 用于匹配的部分url
   * @param {Object} [query] 请求携带的 query 参数
   * @param {String} [resourceType] 资源类型
   * @param {Number} [status] 状态码
   * @return {Boolean}
   * @author helinjiang
   */
  isExistInNetwork(
    partialURL: string,
    query?: { [key: string]: any },
    resourceType?: ResourceType,
    status?: number,
  ): boolean {
    const queue = this.getNetwork(resourceType);

    let result = false;

    // 只要找到其中一个匹配即可返回
    for (let i = 0; i < queue.length; i++) {
      const queueItem = queue[i];
      const method = (queueItem.method || 'GET').toUpperCase();

      if (method === 'POST') {
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
   * @author helinjiang
   */
  isExistPage(partialURL: string, query?: { [key: string]: any }, status?: number): boolean {
    return this.isExistInNetwork(partialURL, query, 'document', status);
  }

  /**
   * 是否存在某个 xhr 请求
   *
   * @param {String} partialURL 用于匹配的部分url
   * @param {Object} [query] 请求携带的 query 参数
   * @param {Number} [status] 状态码
   * @return {Boolean}
   * @author helinjiang
   */
  isExistXHR(partialURL: string, query?: { [key: string]: any }, status?: number): boolean {
    return (
      this.isExistInNetwork(partialURL, query, 'xhr', status) ||
      this.isExistInNetwork(partialURL, query, 'fetch', status)
    );
  }

  /**
   * 是否存在某个 image 请求
   *
   * @param {String} partialURL 用于匹配的部分url
   * @param {Object} [query] 请求携带的 query 参数
   * @param {Number} [status] 状态码
   * @return {Boolean}
   * @author helinjiang
   */
  isExistImage(partialURL: string, query?: { [key: string]: any }, status?: number): boolean {
    return this.isExistInNetwork(partialURL, query, 'image', status);
  }

  /**
   * 是否存在某个 stylesheet 请求
   *
   * @param {String} partialURL 用于匹配的部分url
   * @param {Object} [query] 请求携带的 query 参数
   * @param {Number} [status] 状态码
   * @return {Boolean}
   * @author helinjiang
   */
  isExistStylesheet(partialURL: string, query?: { [key: string]: any }, status?: number): boolean {
    return this.isExistInNetwork(partialURL, query, 'stylesheet', status);
  }

  /**
   * 是否存在某个 script 请求
   *
   * @param {String} partialURL 用于匹配的部分url
   * @param {Object} [query] 请求携带的 query 参数
   * @param {Number} [status] 状态码
   * @return {Boolean}
   * @author helinjiang
   */
  isExistScript(partialURL: string, query?: { [key: string]: any }, status?: number): boolean {
    return this.isExistInNetwork(partialURL, query, 'script', status);
  }

  /**
   * 是否存在某个 jsbridge 的调用
   *
   * @param {String} partialURL 用于匹配的部分url
   * @param {Object} [query] 请求携带的 query 参数
   * @return {Boolean}
   * @author helinjiang
   */
  isExistJSBridge(partialURL: string, query?: { [key: string]: any }): boolean {
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
}

class NightmareQueueHandler implements MatmanResultQueueHandler {
  queue: MatmanResultQueueItemNightmare[];

  constructor(queue: MatmanResultQueueItem[]) {
    /**
     * 从页面获得的数据
     * @type {Array}
     */
    this.queue = queue as MatmanResultQueueItemNightmare[];
  }

  /**
   * 从结果队列中过滤出网络请求
   *
   * @param {ResourceType} [resourceType] 资源类型
   * @return {Array}
   * @author helinjiang
   */
  getNetwork(resourceType?: ResourceType): MatmanResultQueueItemNightmare[] {
    const queue = this.queue;

    return queue.filter(item => {
      if (item.eventName !== 'did-get-response-details') {
        return false;
      }

      if (!item.args || item.args.length < 4) {
        return false;
      }

      // 如果定义了 resourceType 但又不匹配，则放弃之
      if (resourceType && item.args[item.args.length - 1] !== resourceType) {
        return false;
      }

      // 这是真实的请求 originalURL
      return !!item.args[3];
    });
  }

  /**
   * 是否存在某个网络请求
   *
   * @param {String} partialURL 用于匹配的部分url
   * @param {Object} [query] 请求携带的 query 参数
   * @param {String} [resourceType] 资源类型
   * @param {Number} [status] 状态码
   * @return {Boolean}
   * @author helinjiang
   */
  isExistInNetwork(
    partialURL: string,
    query?: { [key: string]: any },
    resourceType?: ResourceType,
    status?: number,
  ): boolean {
    const queue = this.getNetwork(resourceType);

    let result = false;

    // 只要找到其中一个匹配即可返回
    for (let i = 0; i < queue.length; i++) {
      const queueItem = queue[i];

      // 如果没有匹配到链接则执行下一个
      if (!isURLMatch(queueItem.args[3], partialURL, query)) {
        continue;
      }

      // 如果匹配了链接，但未匹配 status，也算失败
      if (status && queueItem.args[4] !== status) {
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
   * @author helinjiang
   */
  isExistPage(partialURL: string, query?: { [key: string]: any }, status?: number): boolean {
    return this.isExistInNetwork(partialURL, query, 'mainFrame', status);
  }

  /**
   * 是否存在某个 xhr 请求
   *
   * @param {String} partialURL 用于匹配的部分url
   * @param {Object} [query] 请求携带的 query 参数
   * @param {Number} [status] 状态码
   * @return {Boolean}
   * @author helinjiang
   */
  isExistXHR(partialURL: string, query?: { [key: string]: any }, status?: number): boolean {
    return this.isExistInNetwork(partialURL, query, 'xhr', status);
  }

  /**
   * 是否存在某个 image 请求
   *
   * @param {String} partialURL 用于匹配的部分url
   * @param {Object} [query] 请求携带的 query 参数
   * @param {Number} [status] 状态码
   * @return {Boolean}
   * @author helinjiang
   */
  isExistImage(partialURL: string, query?: { [key: string]: any }, status?: number): boolean {
    return this.isExistInNetwork(partialURL, query, 'image', status);
  }

  /**
   * 是否存在某个 stylesheet 请求
   *
   * @param {String} partialURL 用于匹配的部分url
   * @param {Object} [query] 请求携带的 query 参数
   * @param {Number} [status] 状态码
   * @return {Boolean}
   * @author helinjiang
   */
  isExistStylesheet(partialURL: string, query?: { [key: string]: any }, status?: number): boolean {
    return this.isExistInNetwork(partialURL, query, 'stylesheet', status);
  }

  /**
   * 是否存在某个 script 请求
   *
   * @param {String} partialURL 用于匹配的部分url
   * @param {Object} [query] 请求携带的 query 参数
   * @param {Number} [status] 状态码
   * @return {Boolean}
   * @author helinjiang
   */
  isExistScript(partialURL: string, query?: { [key: string]: any }, status?: number): boolean {
    return this.isExistInNetwork(partialURL, query, 'script', status);
  }

  /**
   * 是否存在某个 jsbridge 的调用
   *
   * @param {String} partialURL 用于匹配的部分url
   * @param {Object} [query] 请求携带的 query 参数
   * @return {Boolean}
   * @author helinjiang
   */
  isExistJSBridge(partialURL: string, query?: { [key: string]: any }): boolean {
    const queue = this.queue;

    let result = false;

    // 只要找到其中一个匹配即可返回
    for (let i = 0; i < queue.length; i++) {
      const queueItem = queue[i];

      if (queueItem.eventName !== 'did-fail-provisional-load') {
        continue;
      }

      if (!queueItem.args || queueItem.args.length < 4) {
        continue;
      }

      const jsbridge = queueItem.args[3];

      // 如果没有匹配到链接则执行下一个
      if (!isURLMatch(jsbridge, partialURL, query)) {
        continue;
      }

      result = true;
      break;
    }

    return result;
  }
}
