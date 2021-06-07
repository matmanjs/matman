const { PluginMockstarMaterial } = require('../../../../../../../packages/matman');

module.exports = new PluginMockstarMaterial('存在金额', {
  queryMap: {
    // 获取金额
    'get-money': 'success',
  },
});
