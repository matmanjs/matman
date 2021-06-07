const { PluginMockstarInstance } = require('../../../../../../../packages/matman');

module.exports = new PluginMockstarInstance('存在金额', {
  queryMap: {
    // 获取金额
    'get-money': 'success',
  },
});
