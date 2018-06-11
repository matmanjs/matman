const path = require('path');
const chai = require('chai');
const expect = chai.expect;

const MockerParser = require('../../../src/mocker/MockerParser');
const Mocker = require('../../../src/mocker/Mocker');
const MockModule = require('../../../src/mocker/MockModule');

describe.only('./mocker/MockerParser.js', () => {
    let mockerParser;

    before(() => {
        mockerParser = new MockerParser({
            basePath: path.resolve(__dirname, '../../data/fixtures/mock_service/mockers')
        });

        // console.log(mockerParser);
    });

    describe('check basic info', () => {
        it('should be instanceof MockerParser ', () => {
            expect(mockerParser).to.be.an.instanceof(MockerParser);
        });

        it('should contain some fields', () => {
            expect(mockerParser).to.have.all.keys('basePath', 'matmanMockers');
        });
    });

    describe('check demo_01', () => {
        it('mockerParser.getMockerByName(\'demo_01\') should return correct mocker', () => {
            let mocker = mockerParser.getMockerByName('demo_01');

            expect(mocker).to.be.an.instanceof(Mocker);
            expect(mocker.name).to.equal('demo_01');
            expect(mocker.mockModuleList).to.have.lengthOf(2);
        });

        it('mockerParser.getMockModuleByName(\'demo_01\', \'error\') should return correct mockModule', () => {
            let mockModule = mockerParser.getMockModuleByName('demo_01', 'error');

            expect(mockModule).to.be.an.instanceof(MockModule);
            expect(mockModule.name).to.equal('error');

            return mockModule.getResult()
                .then((data) => {
                    expect(data).to.eql({
                        errCode: 100000
                    });
                });
        });
    });

    describe('check demo_02', () => {
        it('mockerParser.getMockerByName(\'demo_02\') should return correct mocker', () => {
            let mocker = mockerParser.getMockerByName('demo_02');

            expect(mocker).to.be.undefined;
        });

        it('mockerParser.getMockerByName(\'demo_02_renamed\') should return correct mocker', () => {
            let mocker = mockerParser.getMockerByName('demo_02_renamed');

            expect(mocker).to.be.an.instanceof(Mocker);
            expect(mocker.name).to.equal('demo_02_renamed');
            expect(mocker.mockModuleList).to.have.lengthOf(5);
        });

        it('mockerParser.getMockModuleByName(\'demo_02_renamed\', \'error\') should return correct mockModule', () => {
            let mockModule = mockerParser.getMockModuleByName('demo_02_renamed', 'error');

            expect(mockModule).to.be.an.instanceof(MockModule);
            expect(mockModule.name).to.equal('error');

            return mockModule.getResult()
                .then((data) => {
                    expect(data).to.eql({
                        errCode: 100000
                    });
                });
        });

        it('mockerParser.getMockModuleByName(\'demo_02_renamed\', \'success_1\') should return correct mockModule', () => {
            let mockModule = mockerParser.getMockModuleByName('demo_02_renamed', 'success_1');

            expect(mockModule).to.be.an.instanceof(MockModule);
            expect(mockModule.name).to.equal('success_1');

            return mockModule.getResult()
                .then((data) => {
                    expect(data).to.eql({
                        'result': {
                            'other': 'other',
                            'result': 1
                        },
                        'retcode': 0
                    });
                });
        });

        it('mockerParser.getMockModuleByName(\'demo_02_renamed\', \'success_2\') should return correct mockModule', () => {
            let mockModule = mockerParser.getMockModuleByName('demo_02_renamed', 'success_2');

            expect(mockModule).to.be.an.instanceof(MockModule);
            expect(mockModule.name).to.equal('success_2');

            return mockModule.getResult()
                .then((data) => {
                    expect(data).to.eql({
                        'result': 2
                    });
                });
        });

        it('mockerParser.getMockModuleByName(\'demo_02_renamed\', \'success_3_renamed\') should return correct mockModule', () => {
            let mockModule = mockerParser.getMockModuleByName('demo_02_renamed', 'success_3_renamed');

            expect(mockModule).to.be.an.instanceof(MockModule);
            expect(mockModule.name).to.equal('success_3_renamed');

            return mockModule.getResult()
                .then((data) => {
                    expect(data).to.eql({
                        'result': 3
                    });
                });
        });

        it('mockerParser.getMockModuleByName(\'demo_02_renamed\', \'success_4\') should return correct mockModule', () => {
            let mockModule = mockerParser.getMockModuleByName('demo_02_renamed', 'success_4');

            expect(mockModule).to.be.an.instanceof(MockModule);
            expect(mockModule.name).to.equal('success_4');

            return mockModule.getResult()
                .then((data) => {
                    expect(data).to.equal(4);
                });
        });
        it('mockerParser.getMockModuleByName(\'demo_02_renamed\', \'success_4\') with param should return correct mockModule', () => {
            let mockModule = mockerParser.getMockModuleByName('demo_02_renamed', 'success_4');

            expect(mockModule).to.be.an.instanceof(MockModule);
            expect(mockModule.name).to.equal('success_4');

            return mockModule.getResult({ a: 110 })
                .then((data) => {
                    expect(data).to.equal('from_param_110');
                });
        });
    });

    describe('check getMockerByRoute', () => {
        it('should return demo_01', () => {
            let mocker = mockerParser.getMockerByRoute('/cgi-bin/a/b/demo_01');

            expect(mocker).to.be.an.instanceof(Mocker);
            expect(mocker.name).to.equal('demo_01');
        });

        it('should return demo_02', () => {
            let mocker = mockerParser.getMockerByRoute('/cgi-bin/a/b/demo_02');

            expect(mocker).to.be.an.instanceof(Mocker);
            expect(mocker.name).to.equal('demo_02_renamed');
        });

    });
});

