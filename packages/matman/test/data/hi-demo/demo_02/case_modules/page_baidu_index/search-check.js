const matman = require('../../../../../../');

function getResult(opts) {
    return matman

        // 创建 PageDriver，页面驱动控制器
        .createPageDriver(__filename, opts)

        // 无头浏览器使用 nightmare.js 框架提供，其底层用的是 Google 的 electron，基于 chromium 内核
        .useNightmare({ show: opts.show })

        // 设置浏览器参数
        .setDeviceConfig({
            'UA': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.75 Safari/537.36 mycustomua',
            'width': 1250,
            'height': 400
        })

        // 设置 cookie
        .setCookies('mykey1=myvalue1; mykey2=myvalue2')

        // 设置截屏
        .setScreenshotConfig(true)

        // 加载页面地址
        .goto('https://www.baidu.com')

        // 第一步：开始操作之前
        .addAction('init', function (nightmareRun) {
            // nightmareRun 支持所有的原始 nightmare 语法和对其定制的扩展功能
            return nightmareRun.wait(500);
        })

        // 第二步：搜索输入框输入: matman
        .addAction('input_key_word', function (nightmareRun) {
            // nightmareRun 支持所有的原始 nightmare 语法和对其定制的扩展功能
            return nightmareRun.type('#kw', 'matman').wait(500);
        })

        // 第三步：点击搜索按钮，获得搜索结果
        .addAction('click_to_search', function (nightmareRun) {
            return nightmareRun.click('#su').wait('#content_left');
        })

        // 需要等待某些条件达成，才开始运行爬虫脚本
        .wait('#su')

        // 执行爬虫脚本文件或者爬虫脚本函数
        .evaluate('./crawlers/get-page-info-for-search.js')

        // 执行自定义的方法
        .executeCustomFn((pageDriver) => {
            // 没有其他的意义，只是为了 debug
            if (opts.show) {
                console.log(pageDriver);
            }
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
