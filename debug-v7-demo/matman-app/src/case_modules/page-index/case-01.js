const { CaseModule } = require('../../../../../packages/matman');

const device = require('../../materials/puppeteer/device/iPhone6');
const mockstar = require('./materials/mock-services/basic');
const userAction = require('./materials/user-actions/basic-check');

module.exports = new CaseModule('观测页面的基础UI信息', {
  // pluginAppMaterial: true,
  userAction,
  webCrawler: './materials/web-crawlers/get-page-info.js',
  mockstar,
  device,
}, {
  useRecorder: true,
});

// (() => {
//   const { debugCaseModule } = require('../../../../../packages/matman');
//   const pipeline = require('../../pipelines/prod');
//
//   // 调试
//   debugCaseModule(pipeline, module.exports, {
//     doNotCloseBrowser: false,
//   })
//     .then(data => {
//       console.log(JSON.stringify(data, null, 2));
//     })
//     .catch(err => {
//       console.error(err);
//     });
// })();
