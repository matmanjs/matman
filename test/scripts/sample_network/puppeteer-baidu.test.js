const expect = require('chai').expect;

const checkPage = require('../../../demo/sample_network/puppeteer-baidu');

describe('(puppeteer-baidu)网络-百度首页：常规检查', function () {
  this.timeout(30000);

  let resultData;

  before(function () {
    return checkPage({show: false, doNotCloseBrowser: false, useRecorder: true}).then(function (
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

    it('网站title应该为：百度一下，你就知道', function () {
      expect(data.title).to.equal('百度一下，你就知道');
    });
  });

  describe('检查网络请求', function () {
    it('请求了页面: https://www.baidu.com', function () {
      expect(resultData.isExistPage('https://www.baidu.com')).to.be.true;
    });

    it('没有请求页面: https://www.qq.com', function () {
      expect(resultData.isExistPage('https://www.qq.com')).to.be.false;
    });

    it('请求了图片: https://www.baidu.com/img/flexible/logo/pc/result.png', function () {
      expect(resultData.isExistImage('https://www.baidu.com/img/flexible/logo/pc/result.png')).to.be
        .true;
    });

    it('请求了js: https://passport.baidu.com/passApi/js/wrapper.js', function () {
      expect(resultData.isExistScript('https://passport.baidu.com/passApi/js/wrapper.js')).to.be
        .true;
    });
  });
});
