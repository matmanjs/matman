const { e2eTest } = require('@tencent/iv-tester');
const env = require('../../env');
const matman = require('matman');

function getResult(opts) {
    return matman

        // 创建 PageDriver，页面驱动脚本
        .createPageDriver(__filename, { doNotEnd: true, useRecorder: true })

        // 基于 nightmare.js 框架，未来可以扩展其他的端对端测试工具
        .useNightmare({ show: true })

        // 走指定的代理服务，由代理服务配置请求加载本地项目，从而达到同源测试的目的
        // 若不配置，则之前请求现网，亦可直接测试现网的服务
        .useProxyServer(env.getProxyServer(true))

        // TODO 支持动态设置本次请求动态设置规则，这样可以支持自定义的代理mock数据等场景
        // .useWhistle()

        // 使用 mockstar 工具来做接口 mock 数据
        .useMockstar({
            'get_tenpay_auth_info': 'success'
        })

        // 为浏览器注入cookie，格式与 document.cookie 一致
        .setCookie('uin=o012345678')

        // 设置浏览器参数
        .setDeviceConfig({
            'name': 'mydevice',
            'UA': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.75 Safari/537.36',
            'width': 1250,
            'height': 400
        })

        // 设置截屏
        .setScreenshotConfig(true)

        // 设置覆盖率配置，有默认值
        .setCoverageConfig({})

        // 加载页面地址
        .goto(env.getPageUrl(true))

        // 第一步：开始操作之前
        .addAction('init', function (nightmareRun) {
            // nightmareRun 支持所有的原始 nightmare 语法和对其定制的扩展功能
            return nightmareRun.wait(500);
        })

        // 第二步：身份证输入框输入: 至尊宝
        .addAction('input-name', function (nightmareRun) {
            // nightmareRun 支持所有的原始 nightmare 语法和对其定制的扩展功能
            return nightmareRun.type('#name-value', '至尊宝').wait(500);
        })

        // 执行爬虫脚本之前，需要等待某些条件达成，与 nightmare 的 wait 含义和用法一致
        .wait(env.OPTS.WAIT)

        // 执行爬虫脚本，这里要么是约定的相对路径，要么是绝对路径，只支持本地文件
        // TODO 需要支持原生的自定义函数脚本，这样在某些场景下可以不用单独写爬虫脚本
        .evaluate('../../crawlers/get-page-info.js')

        // 结束，获取结果
        .end()

        // 结果值处理
        .then(function (result) {
            // 过滤出是否跳转到其他页面
            const pageWithdraw = 'now.qq.com/activity/c-annual-redpacket/withdraw.html?from=qqbrowser&_bid=3632&now_id=93033660';

            result.isRedirectToPageWithdraw = new e2eTest.RequestQueue(result.globalInfo.recorder.queue).isExistPage(pageWithdraw);

            return result;
        });
}

module.exports = getResult;

// getResult({ show: true, doNotEnd: true, useRecorder: true })
//     .then(function (result) {
//         console.log(JSON.stringify(result));
//     })
//     .catch(function (error) {
//         console.error('failed:', error);
//     });


