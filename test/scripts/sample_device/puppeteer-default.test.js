const expect = require('chai').expect;

const checkPage = require('../../../demo/sample_device/puppeteer-default');

describe('(puppeteer-default)百度首页：常规检查', function () {
  this.timeout(30000);

  let matmanResult;

  before(async function () {
    matmanResult = await checkPage({show: false, doNotCloseBrowser: false, useRecorder: false});
  });

  describe('检查基本信息', function () {
    let data;

    before(function () {
      data = matmanResult.get(0);
    });

    it('网站title应该为：百度一下，你就知道', function () {
      expect(data.title).to.equal('百度一下，你就知道');
    });

    it('userAgent应该正确', function () {
      expect(data.userAgent).to.equal(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Safari/537.36 matman/DEVICE_CHROME',
      );
    });

    it('窗体宽度 width=800', function () {
      expect(data.width).to.equal(800);
    });

    it('窗体宽度 height=600', function () {
      expect(data.height).to.equal(600);
    });
  });
});
