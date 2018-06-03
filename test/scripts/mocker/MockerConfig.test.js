const chai = require('chai');
const expect = chai.expect;

const MockerConfig = require('../../../src/mocker/MockerConfig');
const MockModule = require('../../../src/mocker/MockModule');

const mockModuleList = [];

mockModuleList.push(new MockModule('return-plain-object', require('../../data/fixtures/mock_modules/return-plain-object')));
mockModuleList.push(new MockModule('exist-config', require('../../data/fixtures/mock_modules/exist-config')));

describe('./mocker/MockerConfig.js', () => {
    describe('check empty.json', () => {
        let mockerConfig;

        before(() => {
            mockerConfig = new MockerConfig('empty', require('../../data/fixtures/mocker-config/empty'), mockModuleList);
            console.log(mockerConfig);
        });

        it('should be instanceof MockerConfig ', () => {
            expect(mockerConfig).to.be.an.instanceof(MockerConfig);
        });

        it('should contain some fields', () => {
            expect(mockerConfig).to.have.all.keys('name', 'description', 'route', 'disable', 'defaultModule', 'activeModule', 'method', 'priority', 'tags', 'lastModified');
        });

        // it('should equal correct value', () => {
        //     expect(mockerConfig).to.eql({
        //         name: 'json-file',
        //         description: 'json-file',
        //         priority: 0,
        //         delay: 0,
        //         query: {
        //             _m_target: 'json-file'
        //         }
        //     });
        // });
    });
});

