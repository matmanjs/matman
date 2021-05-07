const { getErrorData } = require('../../base');

module.exports = function () {
  return getErrorData(100000, '登录态过期');
};
