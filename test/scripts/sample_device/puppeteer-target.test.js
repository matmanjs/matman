const expect = require('chai').expect;

const checkPage = require('../../../demo/sample_device/puppeteer-target');

describe('(puppeteer-target)百度首页：常规检查', function () {
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
        'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1',
      );
    });

    it('窗体宽度 width=414', function () {
      expect(data.width).to.equal(414);
    });

    it('窗体宽度 height=896', function () {
      expect(data.height).to.equal(896);
    });
  });
});
