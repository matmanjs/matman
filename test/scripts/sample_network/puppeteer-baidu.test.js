const expect = require('chai').expect;

const checkPage = require('../../../demo/sample_network/puppeteer-baidu');

describe('(puppeteer-baidu)网络-百度首页：常规检查', function () {
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
  });

  describe('检查网络请求', function () {
    it('请求了页面: https://www.baidu.com', function () {
      expect(matmanResult.isExistPage('https://www.baidu.com')).to.be.true;
    });

    it('没有请求页面: https://www.qq.com', function () {
      expect(matmanResult.isExistPage('https://www.qq.com')).to.be.false;
    });

    it('请求了图片: https://www.baidu.com/img/flexible/logo/pc/result.png', function () {
      expect(matmanResult.isExistImage('https://www.baidu.com/img/flexible/logo/pc/result.png')).to
        .be.true;
    });

    it('请求了js: https://passport.baidu.com/passApi/js/wrapper.js', function () {
      expect(matmanResult.isExistScript('https://passport.baidu.com/passApi/js/wrapper.js')).to.be
        .true;
    });
  });
});
