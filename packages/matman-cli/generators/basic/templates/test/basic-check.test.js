const {expect} = require('chai');

const checkPage = require('../case_modules/page_baidu_index/basic-check.matman');

describe('百度首页：常规检查', function () {
  this.timeout(30000);

  let resultData;

  before(function () {
    return checkPage({
      show: process.env.SHOW_BROWSER || false,
      doNotCloseBrowser: false,
      useRecorder: true,
    }).then(function (matmanResult) {
      // console.log(JSON.stringify(result));
      resultData = matmanResult;
    });
  });

  describe('检查基本信息', function () {
    let data;

    before(function () {
      data = resultData.get('init');
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
  });
});
