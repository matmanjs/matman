const path = require('path');
const matman = require('../../packages/matman');
const { BrowserRunner } = require('../../packages/matman-runner-puppeteer');

module.exports = async pageDriverOpts => {
  const pageDriver = matman.launch(new BrowserRunner(), pageDriverOpts);

  await pageDriver.setPageUrl('https://www.baidu.com');

  // 第一步：开始操作之前
  await pageDriver.addAction('init', async page => {
    // page 为 puppeteer 的 Page 类对象
    await page.waitFor('#su');
  });

  // 第二步：搜索输入框输入: matman
  await pageDriver.addRunAction(async page => {
    // page 为 puppeteer 的 Page 类对象
    await page.type('#kw', 'matman');
  });

  // 第三步：点击搜索按钮，获得搜索结果
  await pageDriver.addAction('click_to_search', async page => {
    // page 为 puppeteer 的 Page 类对象
    await page.click('#su');
    await page.waitFor('#content_left');
  });

  return await pageDriver.evaluate(() => ({ title: document.title }));
};

// module
//   .exports({
//     show: false,
//     doNotCloseBrowser: true,
//     useRecorder: false,
//   })
//   .then(function (result) {
//     console.log(JSON.stringify(result));
//   })
//   .catch(function (error) {
//     console.error('failed:', error);
//   });
