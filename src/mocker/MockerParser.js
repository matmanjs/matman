class MockerParser {
    /**
     * 构造函数
     *
     * @param {Object} opts 参数
     * @param {String} opts.basePath mocker的根目录
     * @param {Array} [opts.matmanMockers] MatmanMocker 列表
     */
    constructor(opts) {
        this.basePath = opts.basePath;
        this.matmanMockers = [...opts.matmanMockers];
    }

    /**
     * 获取所有的 mocker 信息
     *
     * @param {boolean} [isReset] 是否为重置，如果为 true，则将忽略缓存数据
     * @return {Array}
     */
    getAllMocker(isReset) {

    }
}

module.exports = MockerParser;