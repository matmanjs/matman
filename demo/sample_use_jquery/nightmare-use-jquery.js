const matman = require('../../packages/matman');
const {BrowserRunner} = require('../../packages/matman-runner-nightmare');

module.exports = async pageDriverOpts => {
  const pageDriver = await matman.launch(new BrowserRunner(), pageDriverOpts);

  await pageDriver.setScreenshotConfig(true);

  await pageDriver.setPageUrl('https://caniuse.com/');

  await pageDriver.addAction('scanPage', page => {
    return page.wait('#main');
  });

  return await pageDriver.evaluate(() => {
    return {
      title: document.title,
      width: window.innerWidth,
      height: window.innerHeight,
      userAgent: navigator.userAgent,
      settingTxt: $('.js-options-toggle').text(),
    };
  });
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
