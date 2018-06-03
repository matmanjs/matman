const chai = require('chai');
const expect = chai.expect;

const MockModuleConfig = require('../../../src/mocker/MockModuleConfig');

describe('./mocker/MockModuleConfig', () => {
    describe('default value', () => {
        let handleModuleInfo;

        before(() => {
            handleModuleInfo = parserUtil.getMixinHandleModuleData('default_value', {});
        });

        it('should return object', () => {
            expect(handleModuleInfo).to.be.an('object');
        });

        it('should contain default values', () => {
            expect(handleModuleInfo).to.include({
                name: 'default_value',
                description: 'default_value',
                priority: 0,
            });
        });

        it('should contain property of query', () => {
            expect(handleModuleInfo.query).to.include({
                _m_target: 'default_value'
            });
        });
    });



});
