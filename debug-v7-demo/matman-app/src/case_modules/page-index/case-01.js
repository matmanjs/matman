const { CaseModule } = require('../../../../../packages/matman');

const device = require('../../materials/puppeteer/device/iPhone6');
const mockstar = require('./materials/mock-services/basic');
const userAction = require('./materials/user-actions/basic-check');

module.exports = new CaseModule('观测页面的基础UI信息', {
  filename: __filename,
  userAction,
  webCrawler: './materials/web-crawlers/get-page-info.js',
  mockstar,
  device,
}, {
  useRecorder: true,
});

console.log(module.exports);

(() => {
  const pipeline = require('../../pipelines/d');

  // 调试
  module.exports.debug(pipeline, {
    doNotCloseBrowser: false,
  })
    .then(data => {
      console.log(JSON.stringify(data, null, 2));
      delete module.exports.pageDriver.browserRunner.script;
      console.log(module.exports);
    })
    .catch(err => {
      console.error(err);
    });
})();
