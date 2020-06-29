const matman = require('../../../../packages/matman');
const {BrowserRunner} = require('../../../../packages/matman-runner-nightmare');

module.exports = pageDriverOpts => {
  return (
    matman

      // 创建 Browser 对象，使用它对浏览器进行设置
      .launchSync(new BrowserRunner(), pageDriverOpts)

      // 走指定的代理服务，由代理服务配置请求加载本地项目，从而达到同源测试的目的
      .useProxyServer(`127.0.0.1:${process.env.PORT || 8899}`)

      // 使用 mockstar 来做构造假数据
      .useMockstar(pageDriverOpts.queryDataMap)

      // 设置浏览器参数
      .setDeviceConfig({
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.75 Safari/537.36 mycustomua',
        viewport: {
          width: 1250,
          height: 400,
        },
      })

      // 设置截屏
      .setScreenshotConfig(true)

      // 加载页面地址
      .setPageUrl('https://www.baidu.com/baidu2.html')

      .addAction('scanPage', nightmare => {
        return nightmare.wait('#loaded');
      })

      // 爬虫脚本的函数，用于获取页面中的数据
      .evaluate(() => {
        return {
          title: document.title,
          sayHello: document.querySelector('#say-hello').innerText,
          msgText: document.querySelector('#msg').innerText,
          loadedText: document.querySelector('#loaded').innerText,
        };
      })
  );
};

// module
//   .exports({
//     show: true,
//     doNotCloseBrowser: true,
//     useRecorder: false,
//     queryDataMap: {
//       demo_cgi: 'success_type_2',
//     },
//   })
//   .then(function (result) {
//     console.log(JSON.stringify(result));
//   })
//   .catch(function (error) {
//     console.error('failed:', error);
//   });
