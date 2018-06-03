const path = require('path');
const MockerConfig = require('./MockerConfig');
const MockModule = require('./MockModule');

class Mocker {
    /**
     * 构造函数
     *
     * @param {String} basePath mocker 的绝对路径
     * @param {Object} [opts] 额外参数
     * @param {String} [opts.defaultName] mocker 的默认名字
     * @param {{name:String, hasConfig:Boolean}[]} [opts.modules] mock module 的基本信息数组
     */
    constructor(basePath, opts = {}) {
        this.basePath = basePath;

        // config.json 的内容
        const config = require(path.join(this.basePath, './config'));

        // 优先使用 config.name，其次是模块名
        this.name = config.name || opts.defaultName;

        // mock module 配置列表
        this.mockModuleList = this._getMockModuleList(opts.modules);

        // mocker config 配置参数
        this.config = new MockerConfig(this.name, config, this.mockModuleList);
    }

    _getMockModuleList(modules) {
        let mockModuleList = [];

        if (modules && modules.length) {
            modules.forEach((item) => {
                let module = require(path.join(this.basePath, './mock_modules', item.name));
                let config = item.hasConfig ? require(path.join(this.basePath, './mock_modules', item.name, 'config')) : undefined;

                mockModuleList.push(new MockModule(item.name, module, config));
            });
        }

        return mockModuleList;

    }
}

module.exports = Mocker;