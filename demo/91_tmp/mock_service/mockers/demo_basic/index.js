const MockModule = require('../../../../../src/mocker/MockModule');

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
const name = config.name || 'demo_basic';

/**
 * mock module 配置列表
 * @type {Array}
 */
const mockModuleList = [];

mockModuleList.push(new MockModule('success_2', require('./mock_modules/success_2')));
mockModuleList.push(new MockModule('success_3', require('./mock_modules/success_3_renamed'), require('./mock_modules/success_3_renamed/config')));
mockModuleList.push(new MockModule('success_4', require('./mock_modules/success_4'), require('./mock_modules/success_4/config')));
mockModuleList.push(new MockModule('error', require('./mock_modules/error')));
mockModuleList.push(new MockModule('success_1', require('./mock_modules/success_1')));

module.exports = {
    name: name,
    isSerialized: isSerialized,
    ROOT_PATH: ROOT_PATH,
    config: config,
    mockModuleList: mockModuleList
};

