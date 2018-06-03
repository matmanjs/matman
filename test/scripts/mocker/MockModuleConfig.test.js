const chai = require('chai');
const expect = chai.expect;

const MockModuleConfig = require('../../../src/mocker/MockModuleConfig');

describe('./mocker/MockModuleConfig', () => {
    describe('check json-file.json', () => {
        let mockModuleConfig;

        before(() => {
            mockModuleConfig = new MockModuleConfig('json-file');
            // console.log(mockModuleConfig);
        });

        it('should return object', () => {
            expect(mockModuleConfig).to.be.an('object');
        });

        it('should contain some fields', () => {
            expect(mockModuleConfig).to.have.all.keys('name', 'description', 'priority', 'delay', 'query');
        });

        it('should equal correct value', () => {
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

    describe('check return-function-promise.js', () => {
        it('should equal correct value', () => {
            expect(new MockModuleConfig('return-function-promise')).to.eql({
                name: 'return-function-promise',
                description: 'return-function-promise',
                priority: 0,
                delay: 0,
                query: {
                    _m_target: 'return-function-promise'
                }
            });
        });
    });

    describe('check return-function-pure.js', () => {
        it('should equal correct value', () => {
            expect(new MockModuleConfig('return-function-pure')).to.eql({
                name: 'return-function-pure',
                description: 'return-function-pure',
                priority: 0,
                delay: 0,
                query: {
                    _m_target: 'return-function-pure'
                }
            });
        });
    });

    describe('check return-function-with-param.js', () => {
        it('should equal correct value', () => {
            expect(new MockModuleConfig('return-function-with-param')).to.eql({
                name: 'return-function-with-param',
                description: 'return-function-with-param',
                priority: 0,
                delay: 0,
                query: {
                    _m_target: 'return-function-with-param'
                }
            });
        });
    });

    describe('check return-plain-object.js', () => {
        it('should equal correct value', () => {
            expect(new MockModuleConfig('return-plain-object')).to.eql({
                name: 'return-plain-object',
                description: 'return-plain-object',
                priority: 0,
                delay: 0,
                query: {
                    _m_target: 'return-plain-object'
                }
            });
        });
    });

    describe('check return-promise.js', () => {
        it('should equal correct value', () => {
            expect(new MockModuleConfig('return-promise')).to.eql({
                name: 'return-promise',
                description: 'return-promise',
                priority: 0,
                delay: 0,
                query: {
                    _m_target: 'return-promise'
                }
            });
        });
    });
});

