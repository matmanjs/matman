import { isURLMatch } from '../util/url';

export default class MatmanResult {
    /**
     * matman 框架执行的结果
     *
     * @param {Object} result
     * @author helinjiang
     */
    constructor(result = {}) {
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
    }

    /**
     * 获得数据
     *
     * @param {String || Number} key 结果的key值，可以是自定义的名字，也可以是数组索引
     * @return {Object}
     * @author helinjiang
     */
    get(key) {
        const i = this._dataIndexMap[key];
        return this.data[typeof i === 'number' ? i : key];
    }

    /**
     * 获得捕获到的请求队列
     *
     * @param {String} [globalInfoRecorderKey]
     * @return {Array}
     * @author helinjiang
     */
    getQueue(globalInfoRecorderKey = 'recorder') {
        return (this.globalInfo[globalInfoRecorderKey] && this.globalInfo[globalInfoRecorderKey].queue) || [];
    }

    /**
     * 获得网络请求
     *
     * @param {String} [resourceType] 资源类型，详见 nightmare-handler 组件中的 RESOURCE_TYPE
     * {
            MAIN_FRAME: 'mainFrame',
            SUB_FRAME: 'subFrame',
            STYLESHEET: 'stylesheet',
            SCRIPT: 'script',
            IMAGE: 'image',
            OBJECT: 'object',
            XHR: 'xhr',
            OTHER: 'other'
        }
     * @return {Array}
     * @author helinjiang
     */
    getNetwork(resourceType) {
        const queue = this.getQueue();

        return queue.filter((item) => {
            if (item.eventName !== 'did-get-response-details') {
                return false;
            }

            if (!item.args || item.args.length < 4) {
                return false;
            }

            // 如果定义了 resourceType 但又不匹配，则放弃之
            if (resourceType && (item.args[item.args.length - 1] !== resourceType)) {
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
    isExistInNetwork(partialURL, query = {}, resourceType, status) {
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
            if (status && (queueItem.args[4] !== status)) {
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
    isExistPage(partialURL, query = {}, status) {
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
    isExistXHR(partialURL, query = {}, status) {
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
    isExistImage(partialURL, query = {}, status) {
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
    isExistStylesheet(partialURL, query = {}, status) {
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
    isExistScript(partialURL, query = {}, status) {
        return this.isExistInNetwork(partialURL, query, 'script', status);
    }
};
