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
  pageDriverOpts: {
    useRecorder: true,
  },
});
