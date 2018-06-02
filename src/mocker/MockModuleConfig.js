const _ = require('lodash');

class MockModuleConfig {
    /**
     * 构造函数
     *
     * @param {String} mockModuleName 名字
     * @param {Object} [config] config.json 中的值，注意 config.json 不一定存在
     * @param {String} [config.name] 名字
     * @param {String} [config.description] 简要描述
     * @param {Number} [config.priority] 管理后台列表中排序的权重，值越大则越排在前面
     * @param {Number} [config.delay] 延时返回的时间，单位 ms
     * @param {Object} [config.query] 标记
     */
    constructor(mockModuleName, config = {}) {
        // 名字，注意名字不能够再被修改
        this.name = mockModuleName;

        // 简要描述
        this.description = config.description || this.name;

        // 管理后台列表中排序的权重，值越大则越排在前面
        this.priority = config.priority || 0;

        // 延时多久返回，如果是 0，则不做延时返回，单位为 ms
        // 可以用来模拟 CGI 返回比较慢的场景
        this.delay = config.delay || 0;

        // 请求中需要携带的额外数据，必须同时满足这个的条件，才算匹配了这个 mock module
        // 换言之，这里可以定义这个 mock module 的唯一标记（类似ID的概念），
        // 满足了这个标记则命中了这个 mock module
        this.query = _.merge({}, config.query, {
            _m_target: mockModuleName
        });
    }
}

module.exports = MockModuleConfig;