import 'mocha';
import { expect } from 'chai';

import MatmanResult from '../../../src/model/MatmanResult';

describe('check model/MatmanResult.js', () => {
  describe('check constructor(result)', () => {
    it('if result has data', () => {
      expect(new MatmanResult({ data: [{ a: 1, b: '2' }] })).to.eql({
        data: [{ a: 1, b: '2' }],
        dataIndexMap: {},
        globalInfo: {},
        queueHandler: null,
        runnerName: 'unknown',
      });
    });
  });

  describe('check get(key)', () => {
    const matmanResult = new MatmanResult(require('../../data/fixtures/model/matman-result-nightmare-01-no-global-info.js'));

    it('get(1) should ok', () => {
      expect(matmanResult.get(1)).to.eql({
        searchInputInfo: { keyWorld: 'matman', searchBtnText: '百度一下' },
        searchResultInfo: { isExist: false, list: [] },
        title: '百度一下，你就知道',
      });
    });

    it('get("input_key_word") should ok', () => {
      expect(matmanResult.get('input_key_word')).to.eql({
        searchInputInfo: { keyWorld: 'matman', searchBtnText: '百度一下' },
        searchResultInfo: { isExist: false, list: [] },
        title: '百度一下，你就知道',
      });
    });

    it('get(10086) should return undefined', () => {
      expect(matmanResult.get(10086)).to.be.undefined;
    });

    it('get("i_am_not_exist") should return undefined', () => {
      expect(matmanResult.get('i_am_not_exist')).to.be.undefined;
    });
  });

  describe('check getQueue()', () => {
    it('matman-result-nightmare-01-no-global-info.js getQueue() should return empty', () => {
      const matmanResult = new MatmanResult(require('../../data/fixtures/model/matman-result-nightmare-01-no-global-info.js'));
      expect(matmanResult.getQueue()).to.be.empty;
    });

    it('matman-result-nightmare-01-with-global-info.js getQueue() should return 78', () => {
      const matmanResult = new MatmanResult(require('../../data/fixtures/model/matman-result-nightmare-01-with-global-info.js'));
      expect(matmanResult.getQueue()).to.have.lengthOf(78);
    });
  });

  describe('check getNetwork(resourceType)', () => {
    it('matman-result-nightmare-01-no-global-info.js getNetwork() should return 0', () => {
      const matmanResult = new MatmanResult(require('../../data/fixtures/model/matman-result-nightmare-01-no-global-info.js'));

      expect(matmanResult.getNetwork()).to.have.lengthOf(0);
    });

    it('matman-result-nightmare-01-with-global-info.js getNetwork() should return 67', () => {
      const matmanResult = new MatmanResult(require('../../data/fixtures/model/matman-result-nightmare-01-with-global-info.js'));
      expect(matmanResult.getNetwork()).to.have.lengthOf(67);
    });

    it('matman-result-nightmare-01-with-global-info.js getNetwork(mainFrame) should return 1', () => {
      const matmanResult = new MatmanResult(require('../../data/fixtures/model/matman-result-nightmare-01-with-global-info.js'));
      expect(matmanResult.getNetwork('mainFrame')).to.have.lengthOf(1);
    });

    it('matman-result-nightmare-01-with-global-info.js getNetwork(subFrame) should return 0', () => {
      const matmanResult = new MatmanResult(require('../../data/fixtures/model/matman-result-nightmare-01-with-global-info.js'));
      expect(matmanResult.getNetwork('subFrame')).to.have.lengthOf(0);
    });

    it('matman-result-nightmare-01-with-global-info.js getNetwork(stylesheet) should return 4', () => {
      const matmanResult = new MatmanResult(require('../../data/fixtures/model/matman-result-nightmare-01-with-global-info.js'));
      expect(matmanResult.getNetwork('stylesheet')).to.have.lengthOf(4);
    });

    it('matman-result-nightmare-01-with-global-info.js getNetwork(script) should return 14', () => {
      const matmanResult = new MatmanResult(require('../../data/fixtures/model/matman-result-nightmare-01-with-global-info.js'));
      expect(matmanResult.getNetwork('script')).to.have.lengthOf(14);
    });

    it('matman-result-nightmare-01-with-global-info.js getNetwork(image) should return 33', () => {
      const matmanResult = new MatmanResult(require('../../data/fixtures/model/matman-result-nightmare-01-with-global-info.js'));
      expect(matmanResult.getNetwork('image')).to.have.lengthOf(33);
    });

    it('matman-result-nightmare-01-with-global-info.js getNetwork(object) should return 0', () => {
      const matmanResult = new MatmanResult(require('../../data/fixtures/model/matman-result-nightmare-01-with-global-info.js'));
      expect(matmanResult.getNetwork('object')).to.have.lengthOf(0);
    });

    it('matman-result-nightmare-01-with-global-info.js getNetwork(xhr) should return 14', () => {
      const matmanResult = new MatmanResult(require('../../data/fixtures/model/matman-result-nightmare-01-with-global-info.js'));
      expect(matmanResult.getNetwork('xhr')).to.have.lengthOf(14);
    });

    it('matman-result-nightmare-01-with-global-info.js getNetwork(other) should return 1', () => {
      const matmanResult = new MatmanResult(require('../../data/fixtures/model/matman-result-nightmare-01-with-global-info.js'));
      expect(matmanResult.getNetwork('other')).to.have.lengthOf(1);
    });
  });

  describe('check isExistInNetwork(partialURL, query = {}, resourceType)', () => {
    const matmanResult = new MatmanResult(require('../../data/fixtures/model/matman-result-nightmare-01-with-global-info.js'));

    it('img/dong_f6764cd1911fae7d460b25e31c7e342c.gif should return true', () => {
      expect(matmanResult.isExistInNetwork('img/dong_f6764cd1911fae7d460b25e31c7e342c.gif')).to.be
        .true;
    });

    it('img/dong_f6764cd1911fae7d460b25e31c7e342c.gif and status=200 should return true', () => {
      expect(matmanResult.isExistInNetwork('img/dong_f6764cd1911fae7d460b25e31c7e342c.gif', {}, '', 200)).to.be.true;
    });

    it('img/dong_f6764cd1911fae7d460b25e31c7e342c.gif and status=404  should return false', () => {
      expect(matmanResult.isExistInNetwork('img/dong_f6764cd1911fae7d460b25e31c7e342c.gif', {}, '', 404)).to.be.false;
    });

    it('https://www.baidu.com should return true', () => {
      expect(matmanResult.isExistInNetwork('https://www.baidu.com')).to.be.true;
    });

    it('https://www.baidu.com/sugrec should return true', () => {
      expect(matmanResult.isExistInNetwork('www.baidu.com/sugrec', { prod: 'pc_his' })).to.be.true;
    });
  });

  describe('check isExistPage(partialURL, query = {})', () => {
    const matmanResult = new MatmanResult(require('../../data/fixtures/model/matman-result-nightmare-01-with-global-info.js'));

    it('https://www.baidu.com should return true', () => {
      expect(matmanResult.isExistPage('https://www.baidu.com')).to.be.true;
    });

    it('https://www.baidu.com and status=200 should return true', () => {
      expect(matmanResult.isExistPage('https://www.baidu.com', {}, 200)).to.be.true;
    });

    it('https://www.baidu.com and status=404 should return true', () => {
      expect(matmanResult.isExistPage('https://www.baidu.com', {}, 404)).to.be.false;
    });

    it('https://www.baidu.com/sugrec should return false', () => {
      expect(matmanResult.isExistPage('www.baidu.com/sugrec', { prod: 'pc_his' })).to.be.false;
    });
  });

  describe('check isExistXHR(partialURL, query = {})', () => {
    const matmanResult = new MatmanResult(require('../../data/fixtures/model/matman-result-nightmare-01-with-global-info.js'));

    it('img/dong_f6764cd1911fae7d460b25e31c7e342c.gif should return false', () => {
      expect(matmanResult.isExistXHR('img/dong_f6764cd1911fae7d460b25e31c7e342c.gif')).to.be.false;
    });

    it('https://www.baidu.com/sugrec should return true', () => {
      expect(matmanResult.isExistXHR('www.baidu.com/sugrec', { prod: 'pc_his' })).to.be.true;
    });

    it('https://www.baidu.com/sugrec and status=200 should return true', () => {
      expect(matmanResult.isExistXHR('www.baidu.com/sugrec', { prod: 'pc_his' }, 200)).to.be.true;
    });

    it('https://www.baidu.com/sugrec and status=500 should return true', () => {
      expect(matmanResult.isExistXHR('www.baidu.com/sugrec', { prod: 'pc_his' }, 500)).to.be.false;
    });
  });

  describe('check isExistConsole(partialText, type)', () => {
    const matmanResult = new MatmanResult(require('../../data/fixtures/model/matman-result-puppeteer.js'));

    it('only partial text should return true', () => {
      expect(matmanResult.isExistConsole('visibility-state')).to.be.true;
    });

    it('partial text with correct type should return true', () => {
      expect(matmanResult.isExistConsole('visibility-state', 'warning')).to.be.true;
    });

    it('partial text with incorrect type should return false', () => {
      expect(matmanResult.isExistConsole('visibility-state', 'log')).to.be.false;
    });

    it('partial text with correct type but isFullMatch should return false', () => {
      expect(matmanResult.isExistConsole('visibility-state', 'warning', true)).to.be.false;
    });

    it('only regex should return true', () => {
      expect(matmanResult.isExistConsole(/\.*visibility-state\.*/)).to.be.true;
    });

    it('regex with correct type should return true', () => {
      expect(matmanResult.isExistConsole(/\.*visibility-state\.*/, 'warning')).to.be.true;
    });

    it('regex with incorrect type should return false', () => {
      expect(matmanResult.isExistConsole(/\.*visibility-state\.*/, 'log')).to.be.false;
    });
  });
});
