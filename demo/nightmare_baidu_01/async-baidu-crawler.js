const path = require('path');
const matman = require('../../packages/matman');
const {BrowserRunner} = require('../../packages/matman-runner-nightmare');

module.exports = async () => {
  const pageDriver = await matman.launch(
    new BrowserRunner({
      show: true,
      doNotCloseBrowser: true,
      useRecorder: false,
    }),
  );

  await pageDriver.setDeviceConfig({
    UA:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.75 Safari/537.36 mycustomua',
    width: 1250,
    height: 400,
  });

  await pageDriver.setScreenshotConfig(true);

  await pageDriver.setPageUrl('https://www.baidu.com');

  // 第一步：开始操作之前
  await pageDriver.addAction('init', function (nightmare) {
    // nightmare 支持所有的原始 nightmare 语法和对其定制的扩展功能
    return nightmare.wait(500);
  });

  // 第二步：搜索输入框输入: matman
  await pageDriver.addAction('input_key_word', function (nightmare) {
    // nightmare 支持所有的原始 nightmare 语法和对其定制的扩展功能
    return nightmare.type('#kw', 'matman').wait(500);
  });

  // 第三步：点击搜索按钮，获得搜索结果
  await pageDriver.addAction('click_to_search', function (nightmare) {
    // nightmare 支持所有的原始 nightmare 语法和对其定制的扩展功能
    return nightmare.click('#su').wait('#content_left');
  });

  await pageDriver.wait('#su');

  return await pageDriver.evaluate(
    path.resolve(__dirname, './crawlers/get-page-info-for-search.js'),
  );
};

module
  .exports()
  .then(function (result) {
    console.log(JSON.stringify(result));
  })
  .catch(function (error) {
    console.error('failed:', error);
  });
