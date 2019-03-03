const utils = require('./utils');

const OPTS = {
    PROXY_SERVER_DEV: 'localhost:8080',
    WAIT: '#container .section-1'
};

module.exports = {
    getPageUrl: utils.getPageUrl,
    OPTS: OPTS
};
