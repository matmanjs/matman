const { expect } = require('chai');

const caseModule = require('../../matman-app/src/case_modules/page-withdraw/case-01');

describe('withdraw.html 提现页面：常规检查', function () {
  this.timeout(30000);

  let matmanResult;

  before(async function () {
    matmanResult = await caseModule.run();
  });

  describe('检查基本信息', function () {
    let data;

    before(function () {
      data = matmanResult.get('init');
    });

    it('数据快照校验通过', function () {
      expect(data).to.eql({
        title: '我是提现页',
        moneyWording: '余额剩余：123.45元',
      });
    });
  });
});
