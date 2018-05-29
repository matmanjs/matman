const urlHandle = require('url-handle');

/**
 * 获取页面的链接地址
 *
 * @param {Boolean} isDev 是否为开发环境
 * @param {Object} urlQueryOpts 附加在 URL 上的额外参数
 * @returns {String}
 */
function getPageUrl(isDev, urlQueryOpts = {}) {
    // 页面的链接
    let pageUrl = '//now.qq.com/app/cmshow/rule.html';

    // 开发场景和生产环境的地址不一样
    if (isDev) {
        pageUrl = 'http:' + pageUrl;

        urlQueryOpts.now_n_http = 1;
    } else {
        pageUrl = 'https:' + pageUrl;

        urlQueryOpts._bid = 3170;
    }

    return urlHandle.getUrl(pageUrl, urlQueryOpts);
}

module.exports = {
    getPageUrl: getPageUrl
};