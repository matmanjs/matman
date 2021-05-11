const { expect } = require('chai');

const caseModule = require('../../matman-app/src/case_modules/page-index/case-01');

describe('index.html 身份证认证页面：常规检查', function () {
  this.timeout(30000);

  let matmanResult;

  before(async function () {
    matmanResult = await caseModule.run({
      show: true,
      doNotCloseBrowser: false,
      useRecorder: true,
    });
  });

  describe('检查基本信息', function () {
    let data;

    before(function () {
      data = matmanResult.get('init');
    });

    it('数据快照校验通过', function () {
      expect(data).to.eql({
        formContentInfo: {
          isExist: true,
          nameValueLabel: '姓名',
          nameValue: '',
          nameValuePlaceholder: '请输入姓名',
        },
        formBtnInfo: {
          isExist: true,
          text: '申请验证',
          isBtnActive: false,
        },
      });
    });
  });
});
