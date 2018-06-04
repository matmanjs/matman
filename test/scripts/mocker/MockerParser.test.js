const path = require('path');
const chai = require('chai');
const expect = chai.expect;

const MockerParser = require('../../../src/mocker/MockerParser');
const Mocker = require('../../../src/mocker/Mocker');
const MockModule = require('../../../src/mocker/MockModule');
const MockerConfig = require('../../../src/mocker/MockerConfig');

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

});

