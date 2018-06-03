const chai = require('chai');
const expect = chai.expect;

const MockModule = require('../../../src/mocker/MockModule');

describe('./mocker/MockModule', () => {
    describe('check json-file.json', () => {
        let mockModule;

        before(() => {
            mockModule = new MockModule('json-file', require('../../data/fixtures/mock_modules/json-file'));
            // console.log(mockModule);
        });

        it('should return object', () => {
            expect(mockModule).to.be.an('object');
        });

        it('should contain some fields', () => {
            expect(mockModule).to.have.all.keys('name', 'module', 'config');
        });

        it('should return correct value', () => {
            return mockModule.getResult()
                .then((data) => {
                    expect(data).to.eql({
                        name: 'json-file.json',
                        age: 16
                    });
                });
        });
    });

    describe('check json-file.json', () => {
        let mockModule;

        before(() => {
            mockModule = new MockModule('json-file', require('../../data/fixtures/mock_modules/json-file'));
            // console.log(mockModule);
        });

        it('should return object', () => {
            expect(mockModule).to.be.an('object');
        });

        it('should contain some fields', () => {
            expect(mockModule).to.have.all.keys('name', 'module', 'config');
        });

        it('should return correct value', () => {
            return mockModule.getResult()
                .then((data) => {
                    expect(data).to.eql({
                        name: 'json-file.json',
                        age: 16
                    });
                });
        });
    });

});

