const { getSuccess } = require('../base');

function getResult() {
    return getSuccess({
        result: 1
    });
}

module.exports = getResult;