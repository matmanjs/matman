const { getFail } = require('../../base');

module.exports = function () {
    return getFail(100000, 'error msg!');
};