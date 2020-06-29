const expect = require('chai').expect;

const checkPage = require('../../../demo/baidu_simple_page/nightmare-sync');

describe('(nightmare-sync)百度首页：常规检查', function () {
  this.timeout(30000);

  let matmanResult;

  before(async function () {
    matmanResult = await checkPage({show: false, doNotCloseBrowser: false, useRecorder: true});
  });

  describe('检查基本信息', function () {
    let data;

    before(function () {
      data = matmanResult.get(0);
    });

    it('网站title应该为：百度一下，你就知道', function () {
      expect(data.title).to.equal('百度一下，你就知道');
    });

    it('搜索按钮的文字应该为：百度一下', function () {
      expect(data.searchBtnTxt).to.equal('百度一下');
    });

    it('userAgent应该正确', function () {
      expect(data.userAgent).to.equal(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.75 Safari/537.36 mycustomua',
      );
    });

    it('窗体宽度 width=1250', function () {
      expect(data.width).to.equal(1250);
    });
  });
});
