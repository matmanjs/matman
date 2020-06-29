import {
  MatmanResult as IMatmanResult,
  MatmanResultQueueItem,
  MatmanResultQueueItemNightmare,
  ResourceType,
  MatmanResultQueueHandler,
} from 'matman-core';

import {isURLMatch} from '../util/url';

interface MatmanResultObj {
  data: unknown[];
  _dataIndexMap?: {
    [key: string]: number;
  };
  globalInfo: {
    [key: string]: {
      runnerName: string;
      queue: MatmanResultQueueItem[];
    };
  };
}

// const RUNNER_NAME = {
//   PUPPETEER: 'puppeteer',
//   NIGHTMARE: 'nightmare',
// };

export default class MatmanResult implements IMatmanResult {
  data: unknown[];

  _dataIndexMap: {
    [key: string]: number;
  };

  globalInfo: {
    [key: string]: {
      runnerName: string;
      queue: MatmanResultQueueItem[];
    };
  };

  queueHandler: MatmanResultQueueHandler;

  /**
   * matman 框架执行的结果
   *
   * @param {Object} result
   * @author helinjiang
   */
  constructor(result: MatmanResultObj) {
    /**
     * 从页面获得的数据
     * @type {Array}
     */
    this.data = result.data || [];

    /**
     * actionName 和数据映射表
     * @type {Object}
     */
    this._dataIndexMap = result._dataIndexMap || {};

    /**
     * 网络请求和浏览器事件等信息
     * @type {Object}
     */
    this.globalInfo = result.globalInfo || {};

    /**
     * 处理队列中的数据
     * @type {NightmareQueueHandler}
     */
    this.queueHandler = new NightmareQueueHandler(this.getQueue());
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
      const i = this._dataIndexMap[actionName];
      return this.data[i];
    }
  }

  /**
   * 获得捕获到的请求队列
   *
   * @param {String} [globalInfoRecorderKey]
   * @return {Array}
   * @author helinjiang
   */
  getQueue(globalInfoRecorderKey = 'recorder'): MatmanResultQueueItem[] {
    if (this.globalInfo[globalInfoRecorderKey] && this.globalInfo[globalInfoRecorderKey].queue) {
      return this.globalInfo[globalInfoRecorderKey].queue;
    }
    return [];
  }

  /**
   * 获得当前 runner 的名字
   *
   * @param {String} [globalInfoRecorderKey]
   * @return {Array}
   * @author helinjiang
   */
  getRunnerName(globalInfoRecorderKey = 'recorder'): string {
    if (
      this.globalInfo[globalInfoRecorderKey] &&
      this.globalInfo[globalInfoRecorderKey].runnerName
    ) {
      return this.globalInfo[globalInfoRecorderKey].runnerName;
    }
    return '';
  }

  /**
   * 从结果队列中过滤出网络请求
   *
   * @param {ResourceType} [resourceType] 资源类型
   * @return {Array}
   * @author helinjiang
   */
  getNetwork(resourceType?: ResourceType): MatmanResultQueueItem[] {
    return this.queueHandler.getNetwork(resourceType);
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
    query = {},
    resourceType?: ResourceType,
    status?: number,
  ): boolean {
    return this.queueHandler.isExistInNetwork(partialURL, query, resourceType, status);
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
  isExistPage(partialURL: string, query = {}, status?: number): boolean {
    return this.queueHandler.isExistPage(partialURL, query, status);
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
  isExistXHR(partialURL: string, query = {}, status?: number): boolean {
    return this.queueHandler.isExistXHR(partialURL, query, status);
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
  isExistImage(partialURL: string, query = {}, status: number): boolean {
    return this.queueHandler.isExistImage(partialURL, query, status);
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
  isExistStylesheet(partialURL: string, query = {}, status: number): boolean {
    return this.queueHandler.isExistStylesheet(partialURL, query, status);
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
  isExistScript(partialURL: string, query = {}, status: number): boolean {
    return this.queueHandler.isExistScript(partialURL, query, status);
  }

  /**
   * 是否存在某个 jsbridge 的调用
   *
   * @param {String} partialURL 用于匹配的部分url
   * @param {Object} [query] 请求携带的 query 参数
   * @return {Boolean}
   * @author helinjiang
   */
  isExistJSBridge(partialURL: string, query = {}): boolean {
    return this.queueHandler.isExistJSBridge(partialURL, query);
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
    query = {},
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
  isExistPage(partialURL: string, query = {}, status?: number): boolean {
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
  isExistXHR(partialURL: string, query = {}, status?: number): boolean {
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
  isExistImage(partialURL: string, query = {}, status: number): boolean {
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
  isExistStylesheet(partialURL: string, query = {}, status: number): boolean {
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
  isExistScript(partialURL: string, query = {}, status: number): boolean {
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
  isExistJSBridge(partialURL: string, query = {}): boolean {
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
