const { CaseModule } = require('../../../npm/matman-plugin-puppeteer');

const iPhone6 = require('../../plugins/puppeteer/device/iPhone6');
// const fast3G = require('../../plugins/puppeteer/network-condition/fast-3g');
const mockOfBasic = require('../../plugins/mockstar/page-index-basic');

const handlerOfBasicCheck = require('./handlers/basic-check');

module.exports = new CaseModule({
  filename: __filename,
  dependencies: {
    appRunner: true,
    mockRunner: mockOfBasic,
  },
  extends: {
    device: iPhone6,
    // networkCondition: fast3G,
  },
  handler: handlerOfBasicCheck,
  crawler: './crawlers/get-page-info.js',
});
