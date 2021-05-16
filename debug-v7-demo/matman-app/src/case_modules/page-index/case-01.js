const { CaseModule } = require('../../../../../packages/matman-plugin-puppeteer');

const iPhone6 = require('../../plugins/puppeteer/device/iPhone6');
const mockOfBasic = require('../../plugins/mockstar/page-index-basic');

const handlerOfBasicCheck = require('./handlers/basic-check');

module.exports = new CaseModule('观测页面的基础UI信息', {
  filename: __filename,
  handler: handlerOfBasicCheck,
  crawler: './crawlers/get-page-info.js',
  dependencies: {
    pluginAppInstance: true,
    pluginMockstarInstance: mockOfBasic,
    deviceInstance: iPhone6,
  },
  pageDriverOpts: {
    useRecorder: true,
  },
});

// (() => {
//   const { debugCaseModule } = require('../../../../../packages/matman-plugin-puppeteer');
//
//   // 调试
//   debugCaseModule(module.exports, {
//     doNotCloseBrowser: false,
//   })
//     .then(data => {
//       console.log(JSON.stringify(data, null, 2));
//     })
//     .catch(err => {
//       console.error(err);
//     });
// })();
