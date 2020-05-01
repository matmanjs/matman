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
});

