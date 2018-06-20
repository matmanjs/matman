const scanPage = require('../../../lib/handle-master/scan-page');
const getPreloadScriptPath = require('../../../lib/client-script/get-preload-script-path');

const env = require('./env/index');

function getResult(opts, useRecorder) {
    // 如何校验，前端页面执行脚本
    let preloadClientScriptPath = getPreloadScriptPath('page_t_rule/crawlers/get-page-info');

    opts = Object.assign({
        proxyServer: env.OPTS.PROXY_SERVER_DEV,
        wait: env.OPTS.WAIT
    }, opts);

    return scanPage(env.getPageUrl(true), preloadClientScriptPath, opts, { useRecorder: useRecorder });
}

module.exports = getResult;

// getResult({ show: true, doNotEnd: true }, true)
//     .then(function (result) {
//         console.log(JSON.stringify(result));
//     })
//     .catch(function (error) {
//         console.error('failed:', error);
//     });


