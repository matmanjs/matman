const { CaseModule } = require('../../../../../packages/matman');

const device = require('../../materials/puppeteer/device/iPhone6');
const mockstar = require('./materials/mock-services/basic');
const userAction = require('./materials/user-actions/basic-check');

module.exports = new CaseModule(__filename, {
  materials: {
    userAction,
    webCrawler: './materials/web-crawlers/get-page-info.js',
    mockstar,
    device,
  },
  pageDriverOpts: {
    useRecorder: true,
  },
}, '观测页面的基础UI信息');

console.log(module.exports);

// TODO ，将 web-crawlers 和 user-actions 也物料化
// 完成这些改造之后，就可以编写自动化测试来确保功能的完善度了

(() => {
  const pipeline = require('../../pipelines/d');

  // 调试
  module.exports.debug(pipeline, {
    doNotCloseBrowser: false,
  }, {
    // doNotSetup: true,
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
