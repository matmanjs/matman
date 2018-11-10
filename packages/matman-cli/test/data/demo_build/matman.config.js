const path = require('path');

module.exports = {
    rootPath: __dirname,
    testPath: path.join(__dirname, './e2e_test'),
    crawlerBuildPath: path.join(__dirname, './build/crawler-script'),
    crawlerMatch: /crawlers[\/|\\].*\.js$/,
    screenshotPath: path.join(__dirname, './build/screenshot2'),
};
