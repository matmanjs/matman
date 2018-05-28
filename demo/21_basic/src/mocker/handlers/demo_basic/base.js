const baseCgi = require('../../base-cgi');

const defaultResult = {
    result: 0,
    other: 'other'
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