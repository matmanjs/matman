const fsHandler = require('fs-handler');

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

    /**
     * 获得该模块的最终结果
     *
     * @param {*} props
     * @returns {Promise}
     */
    getResult(...props) {
        return getTargetResult(this.module, ...props);
    }
}

/**
 * 获得模块内容之后，计算出最终返回值
 *
 * @param {*} saveTarget 有可能是函数、对象或者普通字符串
 * @param {*} props saveTarget 为函数时，会透传给它
 * @return {Promise}
 */
function getTargetResult(saveTarget, ...props) {
    try {
        let result = (typeof saveTarget === 'function') ? saveTarget(...props) : saveTarget;
        return Promise.resolve(result);
    } catch (e) {
        return Promise.reject(e);
    }
}

module.exports = MockModule;