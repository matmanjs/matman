const { CaseModule } = require('../../../npm/matman-plugin-puppeteer');

const iPhoneX = require('../../plugins/device/iPhoneX');
const proxyDev = require('../../plugins/whistle/proxy-dev');
const proxyProd = require('../../plugins/whistle/proxy-prod');
const mockOfBasic = require('../../plugins/mockstar/page-index-basic');
const handlerOfVerifyBasic = require('./handlers/verify-basic');

module.exports = new CaseModule({
  filename: __filename,
  device: iPhoneX,
  proxyServer: process.env.DEBUG_DEV ? proxyDev : proxyProd,
  mock: mockOfBasic,
  crawler: './crawlers/get-page-info.js',
  handler: handlerOfVerifyBasic,
});
