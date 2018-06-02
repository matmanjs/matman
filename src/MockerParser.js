class MockerParser {
    /**
     * 构造函数
     *
     * @param opts 参数
     * @param opts.matmanMockers 参数
     */
    constructor(opts) {
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