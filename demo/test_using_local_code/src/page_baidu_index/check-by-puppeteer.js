const matman = require('../../../../packages/matman');
const {BrowserRunner} = require('../../../../packages/matman-runner-puppeteer');

module.exports = async pageDriverOpts => {
  const pageDriver = await matman.launch(new BrowserRunner(), pageDriverOpts);

  // 走指定的代理服务，由代理服务配置请求加载本地项目，从而达到同源测试的目的
  await pageDriver.useProxyServer(`127.0.0.1:${process.env.PORT || 8899}`);

  await pageDriver.setDeviceConfig({
    UA:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.75 Safari/537.36 mycustomua',
    width: 1250,
    height: 400,
  });

  await pageDriver.setScreenshotConfig(true);

  await pageDriver.setPageUrl('https://www.baidu.com/somepage.html');

  await pageDriver.wait('#say-hello');

  return await pageDriver.evaluate(() => {
    return {
      title: document.title,
      sayHello: document.querySelector('#say-hello').innerText,
    };
  });
};

// module
//   .exports({
//     show: true,
//     doNotCloseBrowser: true,
//     useRecorder: false,
//   })
//   .then(function (result) {
//     console.log(JSON.stringify(result));
//   })
//   .catch(function (error) {
//     console.error('failed:', error);
//   });
