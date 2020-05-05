const path = require('path');
const matman = require('../../../../../../');

function getResult(opts) {
    return matman

        // 创建 PageDriver，页面驱动控制器
        .createPageDriver(__filename, Object.assign({
            rootPath: path.join(__dirname, '../../')
        }, opts))

        // 基于 nightmare.js 框架，未来可以扩展其他的端对端测试工具
        .useNightmare({ show: opts.show })

        // 设置浏览器参数
        .setDeviceConfig({
            'UA': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.75 Safari/537.36 mycustomua',
            'width': 1250,
            'height': 400
        })

        // 设置截屏
        .setScreenshotConfig(true)

        // 加载页面地址
        .goto('https://www.baidu.com')

        // 需要等待某些条件达成，才开始运行爬虫脚本
        .wait('#su')

        // 执行爬虫脚本文件或者爬虫脚本函数
        .evaluate(() => {
            return {
                title: document.title,
                width: window.innerWidth,
                height: window.innerHeight,
                userAgent: navigator.userAgent,
                _version: Date.now(),
                searchBtnTxt: document.querySelector('#su').value
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


