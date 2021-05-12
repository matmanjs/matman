const { expect } = require('chai');

const caseModule = require('../../matman-app/src/case_modules/page-index/case-02');

describe('index.html 身份证认证页面：验证身份证操作基本逻辑', function () {
  this.timeout(30000);

  let resultData;

  before(async function () {
    resultData = await caseModule.run();
  });

  describe('第一步：开始操作之前', function () {
    let data;

    before(function () {
      data = resultData.get('init');
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

    it('姓名为空', function () {
      expect(data.formContentInfo.nameValue).to.be.empty;
    });

    it('身份证为空', function () {
      expect(data.formContentInfo.idValue).to.be.empty;
    });

    it('验证按钮为非激活态，即不可点击', function () {
      expect(data.formBtnInfo.isBtnActive).to.be.false;
    });
  });

  describe('第二步：姓名输入框输入: 至尊宝', function () {
    let data;

    before(function () {
      data = resultData.get('inputName');
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
          nameValue: '至尊宝',
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

    it('姓名为 至尊宝', function () {
      expect(data.formContentInfo.nameValue).to.equal('至尊宝');
    });

    it('身份证为空', function () {
      expect(data.formContentInfo.idValue).to.be.empty;
    });

    it('验证按钮为非激活态，即不可点击', function () {
      expect(data.formBtnInfo.isBtnActive).to.be.false;
    });
  });

  describe('第三步：尝试点击验证按钮', function () {
    let data;

    before(function () {
      data = resultData.get('clickBtnWithoutID');
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
          nameValue: '至尊宝',
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

    it('没有任何消息提示', function () {
      expect(data.messageTipsInfo.isExist).to.be.false;
    });
  });

  describe('第四步：身份证输入框输入: 431129', function () {
    let data;

    before(function () {
      data = resultData.get('inputIdPart1');
    });

    it('数据快照校验通过', function () {
      expect(data).to.eql({
        formBtnInfo: {
          isBtnActive: false,
          isExist: true,
          text: '申请验证',
        },
        formContentInfo: {
          idValue: '431129',
          idValueInputType: 'tel',
          idValueLabel: '身份证',
          idValuePlaceholder: '请输入身份证',
          isExist: true,
          nameValue: '至尊宝',
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

    it('身份证为 431129', function () {
      expect(data.formContentInfo.idValue).to.equal('431129');
    });

    it('验证按钮为非激活态，即不可点击', function () {
      expect(data.formBtnInfo.isBtnActive).to.be.false;
    });
  });

  describe('第五步：身份证输入框继续输入: 199909098888', function () {
    let data;

    before(function () {
      data = resultData.get('inputIdPart2');
    });

    it('数据快照校验通过', function () {
      expect(data).to.eql({
        formBtnInfo: {
          isBtnActive: true,
          isExist: true,
          text: '申请验证',
        },
        formContentInfo: {
          idValue: '431129199909098888',
          idValueInputType: 'tel',
          idValueLabel: '身份证',
          idValuePlaceholder: '请输入身份证',
          isExist: true,
          nameValue: '至尊宝',
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

    it('身份证为 431129199909098888', function () {
      expect(data.formContentInfo.idValue).to.equal('431129199909098888');
    });

    it('验证按钮为激活态，即可点击', function () {
      expect(data.formBtnInfo.isBtnActive).to.be.true;
    });
  });

  describe('第六步：再次尝试点击验证按钮', function () {
    let data;

    before(function () {
      data = resultData.get('clickBtnWithID');
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
        messageTipsInfo: {
          isExist: true,
          isSuccess: true,
          text: '认证成功',
        },
        titleInfo: {
          isExist: true,
          title: '请核实身份信息，确保成功提现',
        },
      });
    });

    it('成功之后清空了输入：姓名', function () {
      expect(data.formContentInfo.nameValue).to.be.empty;
    });

    it('成功之后清空了输入：身份证', function () {
      expect(data.formContentInfo.idValue).to.be.empty;
    });

    it('有消息提示: 认证成功', function () {
      expect(data.messageTipsInfo).to.eql({
        isExist: true,
        isSuccess: true,
        text: '认证成功',
      });
    });

    it('请求了实名认证 verify-identity 的 cgi', function () {
      const result = resultData.isExistXHR('cgi.now.qq.com/cgi-bin/a/b/verify-identity', {
        nameValue: '至尊宝',
        idValue: '431129199909098888',
      });

      expect(result).to.be.true;
    });

    // it('上报了实名认证 verify-identity 的 monitor', function () {
    //   const result = isExistMonitor(resultData, [34450607, 34450608]);
    //
    //   expect(result).to.be.true;
    // });
  });

  describe('第七步：3s后再次获取页面状态', function () {
    it('已经跳转到了提现页面', function () {
      // 过滤出是否跳转到其他页面
      const pageWithdraw = 'now.qq.com/withdraw.html?from=9527';

      const result = resultData.isExistPage(pageWithdraw, {}, 200);

      expect(result).to.be.true;
    });
  });
});
