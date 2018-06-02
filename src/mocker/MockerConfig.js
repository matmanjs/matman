const _ = require('lodash');

class MockerConfig {
    /**
     * 构造函数
     *
     * @param {String} handlerName 名字
     * @param {Object} config config.json 中的值
     * @param {String} config.route 需要处理的路由，只有匹配到这个路由，才会被处理
     * @param {String} [config.name] 名字
     * @param {String} [config.description] 简要描述
     * @param {Boolean} [config.disable] 此mocker是否为禁用状态，一旦设置为 true，则将忽略该mocker，而是去请求现网
     * @param {String} [config.activeModule] 当前激活的 mock module 名字
     * @param {String} [config.defaultModule] 默认初始化时激活的 mock module 名字
     * @param {String} [config.method] http 请求方式，包括 get(默认) 和 post
     * @param {Number} [config.priority] 管理后台列表中排序的权重，值越大则越排在前面
     * @param {Array} [config.tags] 标签，用于过滤，字符串数组
     */
    constructor(handlerName, config = {}) {
        // 名字，注意名字不能够再被修改
        this.name = handlerName;

        // 需要处理的路由，只有匹配到这个路由，才会被处理
        this.route = config.route || '';

        // #57 可能route中不以 / 开头，此时需要增加之
        if (this.route.indexOf('/') !== 0) {
            this.route = '/' + this.route;
        }

        // 简要描述
        this.description = config.description || this.name;

        // 此mocker是否为禁用状态，一旦设置为 true，则将忽略该mocker，而是去请求现网
        this.disable = config.disable || false;

        // 当前激活的 mock module 名字
        // TODO 如果没有配置 defaultModule，则需要设置默认的值，使之不能够为空
        this.activeModule = config.activeModule || config.defaultModule || '';

        // http 请求方式，包括 get(默认) 和 post
        this.method = config.method || 'get';

        // 管理后台列表中排序的权重，值越大则越排在前面
        this.priority = config.priority || 0;

        // 标签，用于过滤，字符串数组
        this.tags = _.union(['全部'], config.tags || []);

        // 最后更新的时间
        this.lastModified = Date.now();
    }
}

module.exports = MockerConfig;