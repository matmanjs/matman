const path = require('path');
const matman = require('../../packages/matman');
const {BrowserRunner} = require('../../packages/matman-runner-puppeteer');

module.exports = async pageDriverOpts => {
  const pageDriver = await matman.launch(new BrowserRunner(), pageDriverOpts);

  await pageDriver.setScreenshotConfig(true);

  await pageDriver.setPageUrl('https://caniuse.com/');

  await pageDriver.addAction('scanPage', async page => {
    await page.waitFor('#main');
  });

  return await pageDriver.evaluate(path.resolve(__dirname, './crawlers/use-npm-pkg.js'));
};

module
  .exports({
    show: true,
    doNotCloseBrowser: true,
    useRecorder: false,
  })
  .then(function (result) {
    console.log(JSON.stringify(result));
  })
  .catch(function (error) {
    console.error('failed:', error);
  });
