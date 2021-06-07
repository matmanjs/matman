const { CaseModule } = require('../../../../../packages/matman');

const device = require('../../materials/puppeteer/device/iPhone6');
const mockService = require('./materials/mock-services/basic');
const userAction = require('./materials/user-actions/basic-check');

module.exports = new CaseModule('观测页面的基础UI信息', {
  filename: __filename,
  materials: {
    // pluginAppMaterial: true,
    userAction,
    webCrawler: './materials/web-crawlers/get-page-info.js',
    mockService,
    device,
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
//   }, 'prod.js')
//     .then(data => {
//       console.log(JSON.stringify(data, null, 2));
//     })
//     .catch(err => {
//       console.error(err);
//     });
// })();
