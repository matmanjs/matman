const env = require('../../env');

function getResult(opts) {
    // 1. 获取 caseParser对象
    const caseParser = env.getCaseParser(__dirname);

    // 2. 获取页面的 url
    let pageUrl = env.getPageUrl(true);

    // 3. 获取 crawlerScript 爬虫脚本路径
    let crawlerScriptPath = caseParser.getCrawlerScriptPath('../../crawlers/get-page-info');

    // 4. 获得一些配置参数
    opts = Object.assign({
        proxyServer: env.getProxyServer(true),
        wait: env.OPTS.WAIT,
        screenshot: true
    }, opts);

    // console.log('-pageUrl-', pageUrl);
    // console.log('-crawlerScriptPath-', crawlerScriptPath);
    // console.log('-opts-', opts);

    // 5. 执行并返回 Promise 结果
    return caseParser.handleScan(pageUrl, crawlerScriptPath, opts);
}

module.exports = getResult;

// getResult({ show: true, doNotEnd: false, useRecorder: false })
//     .then(function (result) {
//         console.log(JSON.stringify(result));
//     })
//     .catch(function (error) {
//         console.error('failed:', error);
//     });


