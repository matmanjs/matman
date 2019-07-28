export default class CaseParserOperateResult {
    constructor(baseHandleResult) {
        this.data = baseHandleResult.data;
        this._dataIndexMap = baseHandleResult._dataIndexMap;
        this.globalInfo = baseHandleResult.globalInfo;
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
};