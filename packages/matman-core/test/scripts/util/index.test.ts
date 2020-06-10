import path from 'path';
import 'mocha';
import {expect} from 'chai';

import {findMatmanConfig, getAbsolutePath, getConfigFilePath} from '../../../src/util';
import {MatmanConfigOpts} from '../../../src/types';

describe('./util/index.js', () => {
  describe('check getConfigFilePath(configPath)', () => {
    it('getConfigFilePath(data/fixtures/util) should return current', () => {
      const targetDir = path.join(__dirname, '../../data/fixtures/util');
      expect(getConfigFilePath(targetDir)).to.equal(path.join(targetDir, 'matman.config.js'));
    });

    it('getConfigFilePath(data/fixtures/util/dir_exist) should return current', () => {
      const targetDir = path.join(__dirname, '../../data/fixtures/util/dir_exist');
      expect(getConfigFilePath(targetDir)).to.equal(path.join(targetDir, 'matman.config.js'));
    });

    it('getConfigFilePath(data/fixtures/util/dir_lost) should return parent', () => {
      const targetDir = path.join(__dirname, '../../data/fixtures/util/dir_lost');
      expect(getConfigFilePath(targetDir)).to.equal(path.join(targetDir, '../matman.config.js'));
    });

    it('getConfigFilePath(data/fixtures) should return empty', () => {
      const targetDir = path.join(__dirname, '../../data/fixtures');
      expect(getConfigFilePath(targetDir)).to.be.empty;
    });
  });

  describe('check findMatmanConfig(basePath, matmanConfigOpts)', () => {
    it('findMatmanConfig(data/fixtures) should return null', async () => {
      const targetDir = path.join(__dirname, '../../data/fixtures');
      expect(await findMatmanConfig(targetDir)).to.be.null;
    });

    it('findMatmanConfig(data/fixtures/util) should return null because caseModulesPath not exist', async () => {
      const targetDir = path.join(__dirname, '../../data/fixtures/util');
      expect(await findMatmanConfig(targetDir)).to.be.null;
    });

    it('findMatmanConfig(data/fixtures/util/dir_exist) should not return null', async () => {
      const targetDir = path.join(__dirname, '../../data/fixtures/util/dir_exist');

      expect(await findMatmanConfig(targetDir)).not.to.be.null;
    });

    it('findMatmanConfig(data/fixtures/util/dir_exist,opts) should rewrite ok', async () => {
      const targetDir = path.join(__dirname, '../../data/fixtures/util/dir_exist');
      const newRootPath = path.join(__dirname, '../../data/fixtures/demo2');
      const matmanConfig = (await findMatmanConfig(targetDir, {
        rootPath: newRootPath,
        caseModulesPath: './my_case_modules',
        crawlerBuildPath: path.join(newRootPath, './build/my-crawler-script'),
        crawlerMatch: /[/|\\]my-crawlers[/|\\].*\.js$/,
        crawlerInjectJQuery: false,
        screenshotPath: './build/my-screenshot',
        coveragePath: './build/my-coverage_output',
        isDevBuild: true,
      })) as MatmanConfigOpts;

      expect(matmanConfig.rootPath).to.equal(newRootPath);
      expect(matmanConfig.caseModulesPath).to.equal(path.join(newRootPath, './my_case_modules'));
      expect(matmanConfig.crawlerBuildPath).to.equal(
        path.join(newRootPath, './build/my-crawler-script_dev'),
      );
      expect(matmanConfig.crawlerMatch).to.eql(/[/|\\]my-crawlers[/|\\].*\.js$/);
      expect(matmanConfig.crawlerInjectJQuery).to.be.false;
      expect(matmanConfig.isDevBuild).to.be.true;
      expect(matmanConfig.screenshotPath).to.equal(path.join(newRootPath, './build/my-screenshot'));
      expect(matmanConfig.coveragePath).to.equal(
        path.join(newRootPath, './build/my-coverage_output'),
      );

      expect(matmanConfig).to.have.all.keys(
        'rootPath',
        'caseModulesPath',
        'crawlerBuildPath',
        'crawlerMatch',
        'crawlerInjectJQuery',
        'isDevBuild',
        'matmanResultPath',
        'screenshotPath',
        'coveragePath',
      );
    });
  });

  describe('check getAbsolutePath(targetPath, basePath)', () => {
    it('targetPath is absolute and basePath is undefined', () => {
      expect(getAbsolutePath('/home/i/am/absolute/path')).to.equal('/home/i/am/absolute/path');
    });

    it('targetPath is absolute and basePath is relative', () => {
      expect(getAbsolutePath('/home/i/am/absolute/path', './relative/path')).to.equal(
        '/home/i/am/absolute/path',
      );
    });

    it('targetPath is absolute and basePath is absolute', () => {
      expect(getAbsolutePath('/home/i/am/absolute/path', '/data/another/absolute/path')).to.equal(
        '/home/i/am/absolute/path',
      );
    });

    it('targetPath is relative and basePath is undefined', () => {
      expect(getAbsolutePath('./i/am/relative/path')).to.equal(
        path.resolve('./i/am/relative/path'),
      );
    });

    it('targetPath is relative and basePath is relative', () => {
      expect(getAbsolutePath('./i/am/relative/path', './relative2/path')).to.equal(
        path.resolve('./relative2/path', './i/am/relative/path'),
      );
    });

    it('targetPath is relative and basePath is absolute', () => {
      expect(getAbsolutePath('./i/am/relative/path', '/data/another/absolute/path')).to.equal(
        '/data/another/absolute/path/i/am/relative/path',
      );
    });
  });
});
