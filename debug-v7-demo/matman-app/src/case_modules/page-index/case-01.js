const { CaseModule } = require('../../../../../packages/matman-plugin-puppeteer');

// const { E2ERunner } = require('../../../../../packages/matman-core');

const iPhone6 = require('../../plugins/puppeteer/device/iPhone6');
// const fast3G = require('../../plugins/puppeteer/network-condition/fast-3g');
const mockOfBasic = require('../../plugins/mockstar/page-index-basic');

const handlerOfBasicCheck = require('./handlers/basic-check');

module.exports = new CaseModule({
  filename: __filename,
  handler: handlerOfBasicCheck,
  crawler: './crawlers/get-page-info.js',
  dependencies: {
    pluginAppInstance: true,
    pluginMockstarInstance: mockOfBasic,
    deviceInstance: iPhone6,
  },
});

// (async () => {
//   const e2eRunner = new E2ERunner(
//     '/Users/helinjiang/gitprojects/matman/debug-v7-demo/matman-app/matman.config.js',
//   );
//
//   global.matmanE2ERunner = e2eRunner;
//
//   // 测试地址 https://now.qq.com/index.html
//   await e2eRunner.setup();
//
//   // await caseModule.handleDependencies();
//   const result = await module.exports.run({
//     show: true,
//     doNotCloseBrowser: true,
//     useRecorder: true,
//   });
//
//   console.log(JSON.stringify(result, null, 2));
//
//   // 设置代理规则：项目 & mockstar
//
//   // await e2eRunner.runTest();
//
//   // await e2eRunner.teardown();
// })();
