const { CaseModule } = require('../../../../../packages/matman-plugin-puppeteer');

const iPhoneXCustom = require('../../plugins/puppeteer/device/iPhoneXCustom');
const mockOfBasic = require('../../plugins/mockstar/page-index-basic');

const handlerOfVerifyBasic = require('./handlers/verify-basic');

module.exports = new CaseModule({
  filename: __filename,
  handler: handlerOfVerifyBasic,
  crawler: './crawlers/get-page-info.js',
  dependencies: {
    pluginAppInstance: true,
    pluginMockstarInstance: mockOfBasic,
    deviceInstance: iPhoneXCustom,
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
