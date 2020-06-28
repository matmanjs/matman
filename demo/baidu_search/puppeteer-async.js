const path = require('path');
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

  // 设置 cookie
  await pageDriver.setCookieConfig('mykey1=myvalue1; mykey2=puppeteer_async');

  await pageDriver.setPageUrl('https://www.baidu.com');

  // 第一步：开始操作之前
  await pageDriver.addAction('init', async page => {
    // page 为 puppeteer 的 Page 类对象
    await page.waitFor(500);
  });

  // 第二步：搜索输入框输入: matman
  await pageDriver.addAction('input_key_word', async page => {
    await page.type('#kw', 'matman');
  });

  // 第三步：点击搜索按钮，获得搜索结果
  await pageDriver.addAction('click_to_search', async page => {
    // nightmare 支持所有的原始 nightmare 语法和对其定制的扩展功能
    await page.click('#su');
    await page.waitFor('#content_left');
  });

  await pageDriver.wait('#su');

  return await pageDriver.evaluate(
    path.resolve(__dirname, './crawlers/get-page-info-for-search.js'),
  );
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
