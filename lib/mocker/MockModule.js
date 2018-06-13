'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MockModuleConfig = require('./MockModuleConfig');

var MockModule = function () {
    /**
     * 构造函数
     *
     * @param {String} name 名字
     * @param {Object | Function} module require('./index.js')
     * @param {Object} [config] require('./config.json')，有可能没有，此时则为null
     */
    function MockModule(name, module, config) {
        _classCallCheck(this, MockModule);

        this.name = name;
        this.module = module;
        this.config = new MockModuleConfig(name, config);
    }

    /**
     * 获得该模块的最终结果
     *
     * @param {*} props
     * @returns {Promise}
     */


    _createClass(MockModule, [{
        key: 'getResult',
        value: function getResult() {
            for (var _len = arguments.length, props = Array(_len), _key = 0; _key < _len; _key++) {
                props[_key] = arguments[_key];
            }

            return getTargetResult.apply(undefined, [this.module].concat(props));
        }
    }]);

    return MockModule;
}();

/**
 * 获得模块内容之后，计算出最终返回值
 *
 * @param {*} saveTarget 有可能是函数、对象或者普通字符串
 * @param {*} props saveTarget 为函数时，会透传给它
 * @return {Promise}
 */


function getTargetResult(saveTarget) {
    try {
        for (var _len2 = arguments.length, props = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            props[_key2 - 1] = arguments[_key2];
        }

        var result = typeof saveTarget === 'function' ? saveTarget.apply(undefined, props) : saveTarget;
        return Promise.resolve(result);
    } catch (e) {
        return Promise.reject(e);
    }
}

module.exports = MockModule;