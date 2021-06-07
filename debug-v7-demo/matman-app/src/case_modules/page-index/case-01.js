const { CaseModule } = require('../../../../../packages/matman');

const deviceInstance = require('../../materials/puppeteer/device/iPhone6');
const pluginMockstarMaterial = require('./materials/mock-services/basic');
const userAction = require('./materials/user-actions/basic-check');

module.exports = new CaseModule('观测页面的基础UI信息', {
  filename: __filename,
  userAction,
  webCrawler: './materials/web-crawlers/get-page-info.js',
  materials: {
    pluginAppMaterial: true,
    pluginMockstarMaterial,
    deviceInstance,
  },
  pageDriverOpts: {
    useRecorder: true,
  },
});

// (() => {
//   const { debugCaseModule } = require('../../../../../packages/matman');
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
