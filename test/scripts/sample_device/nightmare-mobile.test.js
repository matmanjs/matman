const expect = require('chai').expect;

const checkPage = require('../../../demo/sample_device/nightmare-mobile');

describe('(nightmare-mobile)百度首页：常规检查', function () {
  this.timeout(30000);

  let resultData;

  before(function () {
    return checkPage({show: false, doNotCloseBrowser: false, useRecorder: false}).then(function (
      result,
    ) {
      // console.log(JSON.stringify(result));
      resultData = result;
    });
  });

  describe('检查基本信息', function () {
    let data;

    before(function () {
      data = resultData.data;
    });

    it('网站title应该为：百度一下', function () {
      expect(data.title).to.equal('百度一下');
    });

    it('userAgent应该正确', function () {
      expect(data.userAgent).to.equal(
        'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
      );
    });

    it('窗体宽度 width=375', function () {
      expect(data.width).to.equal(375);
    });
  });
});
