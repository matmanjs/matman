const { getSuccess } = require('../../base');

module.exports = function (params) {
    return getSuccess({
        uid: params.uid || 11111,
        type: 1,
        description: '学生'
    });
};