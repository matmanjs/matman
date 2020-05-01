const matman = require('../../../../../../../');

function getResult(opts) {
    return matman

        // 创建 PageDriver，页面驱动控制器
        .createPageDriver(__filename, { doNotCloseBrowser: opts.doNotCloseBrowser, useRecorder: opts.useRecorder })

        // 基于 nightmare.js 框架，未来可以扩展其他的端对端测试工具
        .useNightmare({ show: opts.show })

        // 走指定的代理服务，由代理服务配置请求加载本地项目，从而达到同源测试的目的
        .useProxyServer(`127.0.0.1:${process.env.PORT || 8899}`)

        // 加载页面地址
        .goto('https://www.baidu.com')

        // 执行爬虫脚本之前，需要等待某些条件达成，与 nightmare 的 wait 含义和用法一致
        .wait('#say-hello')

        // 执行爬虫脚本，这里要么是约定的相对路径，要么是绝对路径，只支持本地文件
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


