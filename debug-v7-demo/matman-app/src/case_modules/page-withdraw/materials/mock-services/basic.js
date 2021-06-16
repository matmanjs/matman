const { PluginMockstarMaterial } = require('../../../../../../../packages/matman');

module.exports = new PluginMockstarMaterial(__filename, {
  queryMap: {
    // 获取金额
    'get-money': 'success',
  },
}, '存在金额');
