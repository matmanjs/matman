const { getSuccess } = require('../../base');

function getResult() {
  return getSuccess({
    result: 2
  });
}

module.exports = getResult;