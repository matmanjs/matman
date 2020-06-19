const path = require("path");
const matman = require("matman");
const { PuppeteerMaster } = require("matman-driver-puppeteer");

module.exports = async () => {
  const page = await new matman.launch(PuppeteerMaster).newPage(__filename);
  // 设置浏览器参数
  await page.setDeviceConfig({
    UA:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.75 Safari/537.36 mycustomua",
    width: 1250,
    height: 400,
  });

  // 设置 cookie
  await page.setCookies("mykey1=myvalue1; mykey2=myvalue2");

  // 设置截屏
  await page.setScreenshotConfig(true);

  // 加载页面地址
  await page.goto("https://www.baidu.com");

  // 第一步：开始操作之前
  await page.addAction("init", async function (page) {
    // nightmare 支持所有的原始 nightmare 语法和对其定制的扩展功能
    await page.waitFor(500);
  });

  // 第二步：搜索输入框输入: matman
  await page.addAction("input_key_word", async function (page) {
    // nightmare 支持所有的原始 nightmare 语法和对其定制的扩展功能
    await page.type("#kw", "matman");
    await page.waitFor(500);
  });

  // 第三步：点击搜索按钮，获得搜索结果
  await page.addAction("click_to_search", async function (page) {
    // nightmare 支持所有的原始 nightmare 语法和对其定制的扩展功能
    await page.click("#su");
    await page.waitFor("#content_left");
  });

  // 需要等待某些条件达成，才开始运行爬虫脚本
  await page.wait("#su");

  // 执行爬虫脚本文件或者爬虫脚本函数
  await page.evaluate(
    path.resolve(__dirname, "./crawlers/get-page-info-for-search.js")
  );

  // 执行自定义的方法
  // await page.executeCustomFn((pageDriver) => {
  //   // 没有其他的意义，只是为了 debug
  //   if (opts.show) {
  //     console.log(pageDriver);
  //   }
  // });

  // 结束，获取结果
  const res = await page.end();
  return res;
};

module
  .exports()
  .then(function (result) {
    console.log(JSON.stringify(result));
  })
  .catch(function (error) {
    console.error("failed:", error);
  });
