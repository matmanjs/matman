const utils = require('../../../lib/utils');

const OPTS = {
    WAIT: '#container .section'
};

/**
 * 获取页面的地址
 * @param isDev
 * @return {String}
 */
function getPageUrl(isDev) {
    return utils.getPageUrl('https://now.qq.com/h5/shake-redpacket/rule.html?_bid=3307', isDev);
}

module.exports = {
    getPageUrl,
    getProxyServer: utils.getProxyServer,
    getCaseParser: utils.getCaseParser,
    OPTS
};
