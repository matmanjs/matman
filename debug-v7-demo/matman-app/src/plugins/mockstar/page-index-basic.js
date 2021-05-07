const { MockRunner } = require('../../../npm/matman-plugin-mockstar');

module.exports = new MockRunner('身份证和手机都校验成功', {
  // 校验身份证
  'verify-identity': 'success',

  // 校验手机
  'verify-phone': 'success',
});
