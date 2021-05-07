const base = require('../../base');

module.exports = function () {
  return base.getErrorData(500, '内部错误');
};
