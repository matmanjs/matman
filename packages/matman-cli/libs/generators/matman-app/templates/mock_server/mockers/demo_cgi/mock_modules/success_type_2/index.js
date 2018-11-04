const { getSuccess } = require('../../base');

module.exports = function () {
    return getSuccess({
        uid: 22222,
        type: 2,
        description: '老师'
    });
};