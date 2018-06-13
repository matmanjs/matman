const { getFail } = require('../../base');

function getResult() {
  return getFail(100000, 'error msg!');
}

module.exports = getResult;