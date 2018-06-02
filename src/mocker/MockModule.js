class MockModule {
    /**
     * 构造函数
     *
     * @param {String} name 名字
     * @param {Object | Function} module require('./index.js')
     * @param {Object} [config] require('./config.json')，有可能没有，此时则为null
     */
    constructor(name, module, config = null) {
        this.name = name;
        this.module = module;
        this.config = config;
    }
}

module.exports = MockModule;