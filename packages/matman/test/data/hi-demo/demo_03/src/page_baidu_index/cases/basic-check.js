const matman = require('../../../../../../../');

function getResult(opts) {
    return matman

        // 创建 PageDriver，页面驱动控制器
        .createPageDriver(__filename, opts)

        // 无头浏览器使用 nightmare.js 框架提供，其底层用的是 Google 的 electron，基于 chromium 内核
        .useNightmare({ show: opts.show })

        // 走指定的代理服务，由代理服务配置请求加载本地项目，从而达到同源测试的目的
        .useProxyServer(`127.0.0.1:${process.env.PORT || 8899}`)

        // 加载页面地址
        .goto('https://www.baidu.com/somepage.html')

        // 需要等待某些条件达成，才开始运行爬虫脚本
        .wait('#say-hello')

        // 执行爬虫脚本文件或者爬虫脚本函数
        .evaluate(() => {
            return {
                title: document.title,
                sayHello: document.querySelector('#say-hello').innerText
            };
        })

        // 结束，获取结果
        .end();
}

module.exports = getResult;

// getResult({ show: true, doNotCloseBrowser: true, useRecorder: false })
//     .then(function (result) {
//         console.log(JSON.stringify(result));
//     })
//     .catch(function (error) {
//         console.error('failed:', error);
//     });


