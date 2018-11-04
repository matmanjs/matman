const matmanE2E = require('packages/matman-e2e/lib/index');

const env = require('./env/index');

function getResult(opts) {
    // 如何校验，前端页面执行脚本
    let preloadClientScriptPath = matmanE2E.util.getPreloadScriptPath('page_rule/crawlers/get-page-info');

    opts = Object.assign({
        proxyServer: env.OPTS.PROXY_SERVER_DEV,
        wait: env.OPTS.WAIT,
        screenshot: __filename
    }, opts);

    return matmanE2E.action.scan(env.getPageUrl(true), preloadClientScriptPath, opts);
}

module.exports = getResult;

getResult({ show: true, doNotEnd: true, useRecorder: true })
    .then(function (result) {
        console.log(JSON.stringify(result));
    })
    .catch(function (error) {
        console.error('failed:', error);
    });


