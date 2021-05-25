const { CaseModule } = require('../../../../../packages/matman-plugin-puppeteer');

const deviceInstance = require('../../materials/puppeteer/device/iPhone6');
const pluginMockstarInstance = require('./mock-services/basic');
const userAction = require('./user-actions/basic-check');

module.exports = new CaseModule('观测页面的基础UI信息', {
  filename: __filename,
  userAction,
  webCrawler: './web-crawlers/get-page-info.js',
  materials: {
    pluginAppInstance: true,
    pluginMockstarInstance,
    deviceInstance,
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
