const Mocker = require('../../../../../src/mocker/Mocker');

// 默认名字
let defaultName = 'demo_simple';

// mock module 的配置信息
let modules = [{
    name: 'error',
    hasConfig: false
}, {
    name: 'success',
    hasConfig: false
}];

module.exports = new Mocker(__dirname, {
    defaultName: defaultName,
    modules: modules
});

