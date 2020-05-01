import { expect } from 'chai';

import MatmanResult from '../../../src/model/MatmanResult';

describe('check model/MatmanResult.js', () => {
    describe('check constructor(result)', () => {
        it('if result is undefined', () => {
            expect(new MatmanResult()).to.eql({
                data: [],
                _dataIndexMap: {},
                globalInfo: {}
            });
        });

        it('if result has data', () => {
            expect(new MatmanResult({ data: [{ a: 1, b: '2' }] })).to.eql({
                data: [{ a: 1, b: '2' }],
                _dataIndexMap: {},
                globalInfo: {}
            });
        });
    });

    describe('check get(key)', () => {
        const matmanResult = new MatmanResult(require('../../data/fixtures/model/matman-result-01-no-global-info'));

        it('get(1) should ok', () => {
            expect(matmanResult.get(1)).to.eql({
                'searchInputInfo': { 'keyWorld': 'matman', 'searchBtnText': '百度一下' },
                'searchResultInfo': { 'isExist': false, 'list': [] },
                'title': '百度一下，你就知道'
            });
        });

        it('get("input_key_word") should ok', () => {
            expect(matmanResult.get('input_key_word')).to.eql({
                'searchInputInfo': { 'keyWorld': 'matman', 'searchBtnText': '百度一下' },
                'searchResultInfo': { 'isExist': false, 'list': [] },
                'title': '百度一下，你就知道'
            });
        });

        it('get(10086) should return undefined', () => {
            expect(matmanResult.get(10086)).to.be.undefined;
        });

        it('get("i_am_not_exist") should return undefined', () => {
            expect(matmanResult.get('i_am_not_exist')).to.be.undefined;
        });
    });

    describe('check getQueue(globalInfoRecorderKey)', () => {
        it('matman-result-01-no-global-info getQueue() should return empty', () => {
            const matmanResult = new MatmanResult(require('../../data/fixtures/model/matman-result-01-no-global-info'));
            expect(matmanResult.getQueue()).to.be.empty;
        });

        it('matman-result-01-with-global-info getQueue() should return 78', () => {
            const matmanResult = new MatmanResult(require('../../data/fixtures/model/matman-result-01-with-global-info'));
            expect(matmanResult.getQueue()).to.have.lengthOf(78);
        });
    });

    describe('check getNetwork(resourceType)', () => {
        it('matman-result-01-no-global-info getNetwork() should return 0', () => {
            const matmanResult = new MatmanResult(require('../../data/fixtures/model/matman-result-01-no-global-info'));

            expect(matmanResult.getNetwork()).to.have.lengthOf(0);
        });

        it('matman-result-01-with-global-info getNetwork() should return 67', () => {
            const matmanResult = new MatmanResult(require('../../data/fixtures/model/matman-result-01-with-global-info'));
            expect(matmanResult.getNetwork()).to.have.lengthOf(67);
        });

        it('matman-result-01-with-global-info getNetwork(mainFrame) should return 1', () => {
            const matmanResult = new MatmanResult(require('../../data/fixtures/model/matman-result-01-with-global-info'));
            expect(matmanResult.getNetwork('mainFrame')).to.have.lengthOf(1);
        });

        it('matman-result-01-with-global-info getNetwork(subFrame) should return 0', () => {
            const matmanResult = new MatmanResult(require('../../data/fixtures/model/matman-result-01-with-global-info'));
            expect(matmanResult.getNetwork('subFrame')).to.have.lengthOf(0);
        });

        it('matman-result-01-with-global-info getNetwork(stylesheet) should return 4', () => {
            const matmanResult = new MatmanResult(require('../../data/fixtures/model/matman-result-01-with-global-info'));
            expect(matmanResult.getNetwork('stylesheet')).to.have.lengthOf(4);
        });

        it('matman-result-01-with-global-info getNetwork(script) should return 14', () => {
            const matmanResult = new MatmanResult(require('../../data/fixtures/model/matman-result-01-with-global-info'));
            expect(matmanResult.getNetwork('script')).to.have.lengthOf(14);
        });

        it('matman-result-01-with-global-info getNetwork(image) should return 33', () => {
            const matmanResult = new MatmanResult(require('../../data/fixtures/model/matman-result-01-with-global-info'));
            expect(matmanResult.getNetwork('image')).to.have.lengthOf(33);
        });

        it('matman-result-01-with-global-info getNetwork(object) should return 0', () => {
            const matmanResult = new MatmanResult(require('../../data/fixtures/model/matman-result-01-with-global-info'));
            expect(matmanResult.getNetwork('object')).to.have.lengthOf(0);
        });

        it('matman-result-01-with-global-info getNetwork(xhr) should return 14', () => {
            const matmanResult = new MatmanResult(require('../../data/fixtures/model/matman-result-01-with-global-info'));
            expect(matmanResult.getNetwork('xhr')).to.have.lengthOf(14);
        });

        it('matman-result-01-with-global-info getNetwork(other) should return 1', () => {
            const matmanResult = new MatmanResult(require('../../data/fixtures/model/matman-result-01-with-global-info'));
            expect(matmanResult.getNetwork('other')).to.have.lengthOf(1);
        });
    });

    describe('check isExistInNetwork(partialURL, query = {}, resourceType)', () => {
        const matmanResult = new MatmanResult(require('../../data/fixtures/model/matman-result-01-with-global-info'));

        it('img/dong_f6764cd1911fae7d460b25e31c7e342c.gif should return true', () => {
            expect(matmanResult.isExistInNetwork('img/dong_f6764cd1911fae7d460b25e31c7e342c.gif')).to.be.true;
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
        const matmanResult = new MatmanResult(require('../../data/fixtures/model/matman-result-01-with-global-info'));

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
        const matmanResult = new MatmanResult(require('../../data/fixtures/model/matman-result-01-with-global-info'));

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
});

