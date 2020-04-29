import path from 'path';
import { expect } from 'chai';

import {
    findCrawlerParser,
    getAbsolutePath,
    getConfigFilePath,
    getFolderNameFromPath,
    getNewFilePathWithTag
} from '../../../src/util';

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

    describe('check getNewFilePathWithTag(filePath, tag)', () => {
        it('filePath is absolute and basePath is undefined', () => {
            expect(getNewFilePathWithTag('/home/i/am/absolute/myfile.png')).to.equal('/home/i/am/absolute/myfile.png');
        });

        it('filePath is absolute and basePath is "mytag"', () => {
            expect(getNewFilePathWithTag('/home/i/am/absolute/myfile.png', 'mytag')).to.equal('/home/i/am/absolute/myfile_mytag.png');
        });

        it('filePath is absolute without extname and basePath is "mytag"', () => {
            expect(getNewFilePathWithTag('/home/i/am/absolute/myfile', 'mytag')).to.equal('/home/i/am/absolute/_mytagmyfile');
        });

        it('filePath is relative and basePath is undefined', () => {
            expect(getNewFilePathWithTag('./i/am/relative/myfile.png')).to.equal('./i/am/relative/myfile.png');
        });

        it('filePath is relative and basePath is "mytag"', () => {
            expect(getNewFilePathWithTag('./i/am/relative/myfile.png', 'mytag')).to.equal('i/am/relative/myfile_mytag.png');
        });

        it('filePath is relative without extname and basePath is "mytag"', () => {
            expect(getNewFilePathWithTag('./i/am/relative/myfile', 'mytag')).to.equal('i/am/relative/_mytagmyfile');
        });
    });

    describe('check getFolderNameFromPath(targetPath)', () => {
        it('targetPath is absolute folder', () => {
            expect(getFolderNameFromPath('/home/i/am/absolute')).to.equal('_home_i_am_absolute');
        });

        it('targetPath is absolute file', () => {
            expect(getFolderNameFromPath('/home/i/am/absolute/myfile.png')).to.equal('_home_i_am_absolute_myfile_png');
        });

        it('targetPath is relative folder with ./', () => {
            expect(getFolderNameFromPath('./i/am/relative/path')).to.equal('i_am_relative_path');
        });

        it('targetPath is relative folder with ../', () => {
            expect(getFolderNameFromPath('../i/am/relative/path')).to.equal('parent_i_am_relative_path');
        });

        it('targetPath is relative folder with ../../', () => {
            expect(getFolderNameFromPath('../../i/am/relative/path')).to.equal('parent_parent_i_am_relative_path');
        });

        it('targetPath is relative folder', () => {
            expect(getFolderNameFromPath('i/am/relative/path')).to.equal('i_am_relative_path');
        });

        it('targetPath is fileName with extname', () => {
            expect(getFolderNameFromPath('myscript.js')).to.equal('myscript_js');
        });

        it('targetPath is fileName without extname', () => {
            expect(getFolderNameFromPath('myscript')).to.equal('myscript');
        });
    });
});
