const expect = require('chai').expect;

const checkPage = require('../../../demo/baidu_search/nightmare-sync');

describe('(nightmare-sync)百度首页：搜索', function () {
  this.timeout(30000);

  let matmanResult;

  before(async function () {
    matmanResult = await checkPage({show: false, doNotCloseBrowser: false, useRecorder: true});
  });

  describe('第一步：开始操作之前', function () {
    let data;

    before(function () {
      data = matmanResult.get('init');
    });

    it('title 应该为： 百度一下，你就知道', function () {
      expect(data.title).to.equal('百度一下，你就知道');
    });

    it('cookie： 应该包含 mykey1=myvalue1; mykey2=nightmare_async', function () {
      expect(data.cookie).to.match(new RegExp('mykey1=myvalue1; mykey2=nightmare_async', 'gi'));
    });

    it('searchInputInfo： 搜索框为空', function () {
      expect(data.searchInputInfo).to.eql({keyWorld: '', searchBtnText: '百度一下'});
    });

    it('searchResultInfo： 没有搜索结果', function () {
      expect(data.searchResultInfo).to.eql({isExist: false, list: []});
    });
  });

  describe('第二步：搜索输入框输入: matman', function () {
    let data;

    before(function () {
      data = matmanResult.get('input_key_word');
    });

    it('title 应该为： 百度一下，你就知道', function () {
      expect(data.title).to.equal('百度一下，你就知道');
    });

    it('searchInputInfo： 搜索框内值为 matman', function () {
      expect(data.searchInputInfo).to.eql({keyWorld: 'matman', searchBtnText: '百度一下'});
    });

    it('searchResultInfo： 没有搜索结果', function () {
      expect(data.searchResultInfo).to.eql({isExist: false, list: []});
    });
  });

  describe('第三步：点击搜索按钮，获得搜索结果', function () {
    let data;

    before(function () {
      data = matmanResult.get('click_to_search');
    });

    it('title 应该为： matman_百度搜索', function () {
      expect(data.title).to.equal('matman_百度搜索');
    });

    it('searchInputInfo： 搜索框内值为 matman', function () {
      expect(data.searchInputInfo).to.eql({keyWorld: 'matman', searchBtnText: '百度一下'});
    });

    it('searchResultInfo： 存在搜索结果', function () {
      expect(data.searchResultInfo.isExist).to.be.true;
    });

    it('searchResultInfo： 搜索之后展示了 10 个结果', function () {
      expect(data.searchResultInfo.list).to.have.lengthOf(10);
    });
  });
});
