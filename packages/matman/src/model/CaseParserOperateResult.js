export default class CaseParserOperateResult {
    constructor(baseHandleResult) {
        this.data = baseHandleResult.data || [];
        this._dataIndexMap = baseHandleResult._dataIndexMap || {};
        this.globalInfo = baseHandleResult.globalInfo || {};
    }

    /**
     * 获得数据
     * @param {String || Number} key 结果的key值，可以是自定义的名字，也可以是数组索引
     * @return {Object}
     */
    get(key) {
        const i = this._dataIndexMap[key];
        return this.data[typeof i === 'number' ? i : key];
    }

    /**
     * 获得捕获到的请求队列
     *
     * @return {Array}
     */
    getQueue() {
        return (this.globalInfo.recorder && this.globalInfo.recorder.queue) || [];
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
};