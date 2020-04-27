import path from 'path';
import { expect } from 'chai';

import { findCrawlerParser, getAbsolutePath, getConfigFilePath } from '../../../src/util';

let targetDir = path.join(__dirname, '../../data/fixtures/util/dir_exist');

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

    describe('check findCrawlerParser(basePath)', () => {
        it('findCrawlerParser(data/fixtures) should return null', () => {
            let targetDir = path.join(__dirname, '../../data/fixtures');
            expect(findCrawlerParser(targetDir)).to.be.null;
        });

        it('findCrawlerParser(data/fixtures/util) should return null', () => {
            let targetDir = path.join(__dirname, '../../data/fixtures/util');
            expect(findCrawlerParser(targetDir)).to.be.null;
        });

        it('findCrawlerParser(data/fixtures/util/dir_exist) should not return null', () => {
            let targetDir = path.join(__dirname, '../../data/fixtures/util/dir_exist');

            expect(findCrawlerParser(targetDir)).not.to.be.null;
        });

    });

    describe('check getAbsolutePath(targetPath, basePath)', () => {
        it('targetPath is absolute and basePath is undefined', () => {
            expect(getAbsolutePath('/home/i/am/absolute/path')).to.equal('/home/i/am/absolute/path');
        });

        it('targetPath is absolute and basePath is relative', () => {
            expect(getAbsolutePath('/home/i/am/absolute/path', './relative/path')).to.equal('/home/i/am/absolute/path');
        });

        it('targetPath is absolute and basePath is absolute', () => {
            expect(getAbsolutePath('/home/i/am/absolute/path', '/data/another/absolute/path')).to.equal('/home/i/am/absolute/path');
        });

        it('targetPath is relative and basePath is undefined', () => {
            expect(getAbsolutePath('./i/am/relative/path')).to.equal(path.resolve('./i/am/relative/path'));
        });

        it('targetPath is relative and basePath is relative', () => {
            expect(getAbsolutePath('./i/am/relative/path', './relative2/path')).to.equal(path.resolve('./relative2/path', './i/am/relative/path'));
        });

        it('targetPath is relative and basePath is absolute', () => {
            expect(getAbsolutePath('./i/am/relative/path', '/data/another/absolute/path')).to.equal('/data/another/absolute/path/i/am/relative/path');
        });
    });
});
