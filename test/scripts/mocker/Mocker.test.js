const path = require('path');
const chai = require('chai');
const expect = chai.expect;

const Mocker = require('../../../src/mocker/Mocker');
const MockModule = require('../../../src/mocker/MockModule');
const MockerConfig = require('../../../src/mocker/MockerConfig');

describe.only('./mocker/Mocker.js', () => {
    describe('check demo_01', () => {
        let mocker;

        before(() => {
            mocker = new Mocker(path.resolve(__dirname, '../../data/fixtures/mock_service/mockers/demo_01'));
            // console.log(mocker);
        });

        it('should be instanceof Mocker ', () => {
            expect(mocker).to.be.an.instanceof(Mocker);
        });

        it('should contain some fields', () => {
            expect(mocker).to.have.all.keys('basePath', 'name', 'mockModuleList', 'config');
        });

        it('mocker.basePath should not empty ', () => {
            expect(mocker.basePath).to.be.a('string').and.not.empty;
        });

        it('mocker.name should be correct ', () => {
            expect(mocker.name).to.equal('demo_01');
        });

        it('mocker.config should be instanceof MockerConfig ', () => {
            expect(mocker.config).to.be.an.instanceof(MockerConfig);
        });

        it('mocker.mockModuleList item should be instanceof MockModule ', () => {
            expect(mocker.mockModuleList[0]).to.be.an.instanceof(MockModule);
        });

        it('mocker.mockModuleList has 2 items', () => {
            expect(mocker.mockModuleList).to.have.lengthOf(2);
        });

        it('mocker.mockModuleList item\'s name is correct', () => {
            let itemNameList = mocker.mockModuleList.map((item) => {
                return item.name;
            });
            expect(itemNameList).to.have.members(['error', 'success']);
        });
    });

    describe('check demo_02', () => {
        let mocker;

        before(() => {
            mocker = new Mocker(path.resolve(__dirname, '../../data/fixtures/mock_service/mockers/demo_02'));
            // console.log(mocker);
        });

        it('mocker.name should be correct ', () => {
            // 只有 mocker 才能优先使用 config.name 的值
            expect(mocker.name).to.equal('demo_02_renamed');
        });

        it('mocker.mockModuleList has 5 items', () => {
            expect(mocker.mockModuleList).to.have.lengthOf(5);
        });

        it('mocker.mockModuleList item\'s name is correct', () => {
            let itemNameList = mocker.mockModuleList.map((item) => {
                return item.name;
            });

            expect(itemNameList).to.have.members([
                'error',
                'success_1',
                'success_2',
                'success_3_renamed',
                'success_4'
            ]);
        });
    });
});

