const baseCgi = require('../../lib/base-cgi');

const defaultResult = {
    result: 0,
    other: 'demo_03_other'
};

function getSuccess(result) {
    return baseCgi.getSuccess(Object.assign({}, defaultResult, result));
}

function getFail(errCode, errMsg = '') {
    return baseCgi.getFail(errCode, errMsg);
}

module.exports = {
    getSuccess: getSuccess,
    getFail: getFail
};