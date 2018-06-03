const chai = require('chai');
const expect = chai.expect;

const MockModuleConfig = require('../../../src/mocker/MockModuleConfig');

describe('./mocker/MockModuleConfig', () => {
    describe('check json-file.json', () => {
        let mockModuleConfig;

        before(() => {
            mockModuleConfig = new MockModuleConfig('json-file', require('../../data/fixtures/mock_modules/json-file'));
            // console.log(mockModuleConfig);
        });

        it('should return object', () => {
            expect(mockModuleConfig).to.be.an('object');
        });

        it('should contain some fields', () => {
            expect(mockModuleConfig).to.have.all.keys('name', 'description', 'priority', 'delay', 'query');
        });

        it('should equal value', () => {
            expect(mockModuleConfig).to.eql({
                name: 'json-file',
                description: 'json-file',
                priority: 0,
                delay: 0,
                query: {
                    _m_target: 'json-file'
                }
            });
        });
    });

});

