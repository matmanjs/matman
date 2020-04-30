const matman = require('../../../../../../../lib');

function getResult(opts) {
    return matman

        // 创建 PageDriver，页面驱动控制器
        .createPageDriver(__filename, { doNotCloseBrowser: opts.doNotCloseBrowser, useRecorder: opts.useRecorder })

        // 基于 nightmare.js 框架，未来可以扩展其他的端对端测试工具
        .useNightmare({ show: opts.show })

        // 设置当前设备参数，有默认值
        .setDeviceConfig({
            'UA': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.75 Safari/537.36 mycustomua',
            'width': 1250,
            'height': 400
        })

        // 设置截屏，默认不截图
        .setScreenshotConfig(true)

        // 加载页面地址
        .goto('https://www.baidu.com')

        // 执行自定义的方法
        .executeCustomFn((pageDriver) => {
            console.log(pageDriver);
        })

        .run('init', function (nightmareRun) {
            // nightmareRun 支持所有的原始 nightmare 语法和对其定制的扩展功能
            return nightmareRun.wait(500);
        })

        .run('input_key_word', function (nightmareRun) {
            // nightmareRun 支持所有的原始 nightmare 语法和对其定制的扩展功能
            return nightmareRun.type('#kw', 'matman').wait(500);
        })

        // 执行爬虫脚本之前，需要等待某些条件达成，与 nightmare 的 wait 含义和用法一致
        .wait('#su')

        // 执行爬虫脚本，这里要么是约定的相对路径，要么是绝对路径，只支持本地文件
        .evaluate('../crawlers/get-page-info-for-search.js')

        // 结束，获取结果
        .end();
}

module.exports = getResult;

getResult({ show: true, doNotCloseBrowser: true, useRecorder: false })
    .then(function (result) {
        console.log(JSON.stringify(result));
    })
    .catch(function (error) {
        console.error('failed:', error);
    });


