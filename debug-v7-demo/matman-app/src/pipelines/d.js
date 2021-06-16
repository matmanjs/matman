const path = require('path');
const { Pipeline } = require('../../../../packages/matman-core');
// TODO 增加 matman-plugin-test matman-plugin-command
// TODO 应该有不同的全局执行脚本，就像本文件一样，它是不同命令的有序组合，用于初始化、销毁、调试、dev场景，
//  此时就不需要在 matman.config.js 中设置 app activated 和 test activated
//  mocha 和 jest 分别一个插件吧
// pipeline start/bootstrap/clean

const pluginAppMaterial = require('../materials/app/prod');
const pluginMochaMaterial = require('../materials/mocha/all');

module.exports = new Pipeline(__filename, {
  pluginAppCurMaterial: pluginAppMaterial,
  pluginMochaCurMaterial: pluginMochaMaterial,
});

// console.log('--1--');
// console.log(JSON.stringify(module.exports,null,2));
//
// module.exports.setup()
//   .then(() => {
//     console.log('--2--');
//     console.log(JSON.stringify(module.exports,null,2));
//
//     // const p2 = new Pipeline('测试生产环境版本2', {
//     //   pluginAppCurMaterial: pluginAppMaterial,
//     //   pluginMochaCurMaterial: pluginMochaMaterial,
//     // });
//
//    const pluginConfigArr = JSON.parse(JSON.stringify(module.exports.matmanConfig.plugins))
//     console.log('--pluginConfigArr--',pluginConfigArr);
//
//     module.exports.updatePlugin(pluginConfigArr)
//
//     console.log('--3333--');
//     console.log(JSON.stringify(module.exports,null,2));
//   });
//
