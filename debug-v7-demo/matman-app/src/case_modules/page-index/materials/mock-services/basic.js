const { PluginMockstarMaterial } = require('../../../../../../../packages/matman');

module.exports = new PluginMockstarMaterial(__filename, {
  queryMap: {
    // 校验身份证
    'verify-identity': 'success',

    // 校验手机
    'verify-phone': 'success',
  },
}, '身份证和手机都校验成功');
