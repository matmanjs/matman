const { CaseModule } = require('../../../../../packages/matman');

const deviceInstance = require('../../materials/puppeteer/device/iPhoneXCustom');
const pluginMockstarInstance = require('./materials/mock-services/basic');
const userAction = require('./materials/user-actions/verify-basic');

module.exports = new CaseModule('验证输入正确姓名和身份证号', {
  filename: __filename,
  userAction,
  webCrawler: './materials/web-crawlers/get-page-info.js',
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
