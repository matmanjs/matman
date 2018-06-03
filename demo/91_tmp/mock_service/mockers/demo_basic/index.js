const Mocker = require('../../../../../src/mocker/Mocker');

// 默认名字
let defaultName = 'demo_basic';

// mock module 的配置信息
let modules = [{
    name: 'success_2',
    hasConfig: false
}, {
    name: 'success_3_renamed',
    hasConfig: true
}, {
    name: 'success_4',
    hasConfig: true
}, {
    name: 'error',
    hasConfig: false
}, {
    name: 'success_1',
    hasConfig: false
}];

module.exports = new Mocker(__dirname, {
    defaultName: defaultName,
    modules: modules
});


