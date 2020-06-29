const matman = require('../../packages/matman');
const {BrowserRunner} = require('../../packages/matman-runner-nightmare');

module.exports = pageDriverOpts => {
  return (
    matman

      // 创建 Browser 对象，使用它对浏览器进行设置
      .launchSync(new BrowserRunner(), pageDriverOpts)

      // 设置截屏
      .setScreenshotConfig(true)

      // 加载页面地址
      .setPageUrl('https://www.baidu.com')

      .addAction('scanPage', nightmare => {
        return nightmare.wait('#index-bn');
      })

      // 爬虫脚本的函数，用于获取页面中的数据
      .evaluate(() => {
        return {
          title: document.title,
          width: window.innerWidth,
          height: window.innerHeight,
          userAgent: navigator.userAgent,
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
