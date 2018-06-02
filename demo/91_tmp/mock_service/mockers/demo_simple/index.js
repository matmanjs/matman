const MockModule = require('../../../../../src/mocker/MockModule');
const MockerConfig = require('../../../../../src/mocker/MockerConfig');

const config = require('./config');

/**
 * 是否序列化之后的标准 mocker 模块
 * @type {Boolean}
 */
const isSerialized = true;

/**
 * 该模块的根目录
 * @type {String}
 */
const ROOT_PATH = __dirname;

/**
 * 模块名字，用于区别不同的模块，建议不重复
 * @type {String}
 */
const name = config.name || 'demo_simple';

/**
 * mock module 配置列表
 * @type {Array}
 */
const mockModuleList = [];

mockModuleList.push(new MockModule('error', require('./mock_modules/error')));
mockModuleList.push(new MockModule('success', require('./mock_modules/success')));

module.exports = {
    name: name,
    isSerialized: isSerialized,
    ROOT_PATH: ROOT_PATH,
    config: new MockerConfig(name, config),
    mockModuleList: mockModuleList
};

