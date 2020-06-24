const matman = require('../../packages/matman');
const {BrowserRunner} = require('../../packages/matman-runner-nightmare');

module.exports = async () => {
  const page = await new matman.launch(PuppeteerRunner, {
    show: true,
    doNotCloseBrowser: true,
    useRecorder: false,
  }).newPage(__filename);

  await page.setDeviceConfig({
    UA:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.75 Safari/537.36 mycustomua',
    width: 1250,
    height: 400,
  });
  await page.setScreenshotConfig(true);
  await page.goto('https://www.baidu.com');
  await page.wait('#su');
  await page.evaluate(() => {
    return {
      title: document.title,
      width: window.innerWidth,
      height: window.innerHeight,
      userAgent: navigator.userAgent,
      _version: Date.now(),
      searchBtnTxt: document.querySelector('#su').value,
    };
  });
  const res = await page.end();
  return res;
};

module
  .exports()
  .then(function (result) {
    console.log(JSON.stringify(result));
  })
  .catch(function (error) {
    console.error('failed:', error);
  });