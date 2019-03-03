const matman = require('matman');

const env = require('./env/index');

const caseParser = new matman.CaseParser(__dirname);

function getResult(opts) {
    // 如何校验，前端页面执行脚本
    let crawlerScriptPath = caseParser.getCrawlerScriptPath('../../crawlers/get-page-info');
    // console.log('---crawlerScriptPath--', crawlerScriptPath);

    opts = Object.assign({
        // proxyServer: env.OPTS.PROXY_SERVER_DEV,
        wait: env.OPTS.WAIT
        // screenshot: __filename
    }, opts);

    let pageUrl = env.getPageUrl(true);
    // console.log('---pageUrl--', pageUrl);

    return caseParser.handleScan(pageUrl, crawlerScriptPath, opts);
}

module.exports = getResult;

getResult({ show: true, doNotEnd: false, useRecorder: false })
    .then(function (result) {
        console.log(JSON.stringify(result));
    })
    .catch(function (error) {
        console.error('failed:', error);
    });


