const path = require('path');

module.exports = {
  clientScriptBuildPath: path.join(__dirname, 'dist-client-script'),
  clientScriptMatch: /crawlers\/.*\.js$/,
  entry: {
    'page_rule/crawlers/get-page-info': path.join(__dirname, 'e2e_test/targets/page_rule/crawlers/get-page-info.js')
  }
};
