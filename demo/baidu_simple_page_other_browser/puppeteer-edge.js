const matman = require('../../packages/matman');
const {BrowserRunner} = require('../../packages/matman-runner-puppeteer');

module.exports = async pageDriverOpts => {
  const pageDriver = await matman.launch(new BrowserRunner(), pageDriverOpts);

  await pageDriver.setDeviceConfig({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.75 Safari/537.36 mycustomua',
    viewport: {
      width: 1250,
      height: 400,
    },
  });

  await pageDriver.setScreenshotConfig(true);

  await pageDriver.setPageUrl('https://www.baidu.com');

  await pageDriver.addAction('scanPage', async page => {
    await page.waitFor('#su');
  });

  return await pageDriver.evaluate(() => {
    return {
      title: document.title,
      width: window.innerWidth,
      height: window.innerHeight,
      userAgent: navigator.userAgent,
      _version: Date.now(),
      searchBtnTxt: document.querySelector('#su').value,
    };
  });
};

// module
//   .exports({
//     show: true,
//     doNotCloseBrowser: true,
//     useRecorder: false,
//     executablePath: '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
//   })
//   .then(function (result) {
//     console.log(JSON.stringify(result));
//   })
//   .catch(function (error) {
//     console.error('failed:', error);
//   });
