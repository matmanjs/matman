const { expect } = require('chai');

const caseModule = require('../../matman-app/src/case_modules/page-index/case-01');

describe('index.html 身份证认证页面：常规检查', function () {
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
        formBtnInfo: {
          isBtnActive: false,
          isExist: true,
          text: '申请验证',
        },
        formContentInfo: {
          idValue: '',
          idValueInputType: 'tel',
          idValueLabel: '身份证',
          idValuePlaceholder: '请输入身份证',
          isExist: true,
          nameValue: '',
          nameValueInputType: 'text',
          nameValueLabel: '姓名',
          nameValuePlaceholder: '请输入姓名',
        },
        messageTipsInfo: { isExist: false },
        titleInfo: {
          isExist: true,
          title: '请核实身份信息，确保成功提现',
        },
      });
    });
  });
});
