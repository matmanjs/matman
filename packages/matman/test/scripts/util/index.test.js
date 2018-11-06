const path = require('path');
const chai = require('chai');
const expect = chai.expect;

const { getConfigFilePath } = require('../../../lib/util');

describe('./util/index.js', () => {
    describe('check getConfigFilePath(configPath)', () => {
        it('getConfigFilePath(data/fixtures/util) should return current', () => {
            let targetDir = path.join(__dirname, '../../data/fixtures/util');
            expect(getConfigFilePath(targetDir)).to.equal(path.join(targetDir, 'matman.config.js'));
        });

        it('getConfigFilePath(data/fixtures/util/dir_exist) should return current', () => {
            let targetDir = path.join(__dirname, '../../data/fixtures/util/dir_exist');
            expect(getConfigFilePath(targetDir)).to.equal(path.join(targetDir, 'matman.config.js'));
        });

        it('getConfigFilePath(data/fixtures/util/dir_lost) should return parent', () => {
            let targetDir = path.join(__dirname, '../../data/fixtures/util/dir_lost');
            expect(getConfigFilePath(targetDir)).to.equal(path.join(targetDir, '../matman.config.js'));
        });

        it('getConfigFilePath(data/fixtures) should return empty', () => {
            let targetDir = path.join(__dirname, '../../data/fixtures');
            expect(getConfigFilePath(targetDir)).to.be.empty;
        });
    });
});
