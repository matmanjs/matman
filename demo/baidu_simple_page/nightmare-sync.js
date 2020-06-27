const matman = require('../../packages/matman');
const {BrowserRunner} = require('../../packages/matman-runner-nightmare');

module.exports = pageDriverOpts => {
  return (
    matman

      // 创建 Browser 对象，使用它对浏览器进行设置
      .launchSync(new BrowserRunner(), pageDriverOpts)

      // 设置浏览器参数
      .setDeviceConfig({
        UA:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.75 Safari/537.36 mycustomua',
        width: 1250,
        height: 400,
      })

      // 设置截屏
      .setScreenshotConfig(true)

      // 加载页面地址
      .setPageUrl('https://www.baidu.com')

      // 需要等待某些条件达成，才开始运行爬虫脚本
      .wait('#su')

      // 爬虫脚本的函数，用于获取页面中的数据
      .evaluate(() => {
        return {
          title: document.title,
          width: window.innerWidth,
          height: window.innerHeight,
          userAgent: navigator.userAgent,
          _version: Date.now(),
          searchBtnTxt: document.querySelector('#su').value,
        };
      })
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
