import path from 'path';
import 'mocha';
import {expect} from 'chai';

import {findMatmanConfig, getAbsolutePath, searchFilePath} from '../../../src/util';
import {MatmanConfigOpts} from '../../../src/types';
import {MATMAN_CONFIG_FILE} from '../../../src/config';
import MatmanConfig from '../../../src/MatmanConfig';

describe('./util/index.js', () => {
  describe('check searchFilePath(configPath)', () => {
    it('searchFilePath(data/fixtures/util) should return current', () => {
      const targetDir = path.join(__dirname, '../../data/fixtures/util');
      expect(searchFilePath(targetDir, MATMAN_CONFIG_FILE)).to.equal(
        path.join(targetDir, 'matman.config.js'),
      );
    });

    it('searchFilePath(data/fixtures/util/dir_exist) should return current', () => {
      const targetDir = path.join(__dirname, '../../data/fixtures/util/dir_exist');
      expect(searchFilePath(targetDir, MATMAN_CONFIG_FILE)).to.equal(
        path.join(targetDir, 'matman.config.js'),
      );
    });

    it('searchFilePath(data/fixtures/util/dir_lost) should return parent', () => {
      const targetDir = path.join(__dirname, '../../data/fixtures/util/dir_lost');
      expect(searchFilePath(targetDir, MATMAN_CONFIG_FILE)).to.equal(
        path.join(targetDir, '../matman.config.js'),
      );
    });

    it('searchFilePath(data/fixtures) should return empty', () => {
      const targetDir = path.join(__dirname, '../../data/fixtures');
      expect(searchFilePath(targetDir, MATMAN_CONFIG_FILE)).to.be.empty;
    });
  });

  describe('check findMatmanConfig(basePath, matmanConfigOpts)', () => {
    it('findMatmanConfig(data/fixtures) should return null', () => {
      const targetDir = path.join(__dirname, '../../data/fixtures');
      const pkgPath = path.join(targetDir, '../../../package.json');
      const matmanConfig = findMatmanConfig(targetDir) as MatmanConfig;

      expect(matmanConfig.rootPath).to.equal(path.dirname(pkgPath));
      expect(matmanConfig.caseModulesPath).to.equal(path.dirname(pkgPath));
    });

    it('findMatmanConfig(data/fixtures/util) should find matman.config.js', () => {
      const targetDir = path.join(__dirname, '../../data/fixtures/util');
      const matmanConfig = findMatmanConfig(targetDir) as MatmanConfig;

      expect(matmanConfig.rootPath).to.equal(targetDir);
      expect(matmanConfig.caseModulesPath).to.equal(targetDir);
    });

    it('findMatmanConfig(data/fixtures/util/dir_exist) should find matman.config.js', () => {
      const targetDir = path.join(__dirname, '../../data/fixtures/util/dir_exist');
      const matmanConfig = findMatmanConfig(
        path.join(targetDir, './case_modules/some-page/crawlers/c1.js'),
      ) as MatmanConfig;

      expect(matmanConfig.rootPath).to.equal(targetDir);
      expect(matmanConfig.caseModulesPath).to.equal(path.join(targetDir, 'case_modules'));
    });

    it('findMatmanConfig(data/fixtures/util/dir_exist, opts) should rewrite ok', () => {
      const targetDir = path.join(__dirname, '../../data/fixtures/util/dir_exist');
      const newRootPath = path.join(__dirname, '../../data/fixtures/demo2');
      const matmanConfig = findMatmanConfig(targetDir, {
        rootPath: newRootPath,
        caseModulesPath: './my_case_modules',
        crawlerBuildPath: path.join(newRootPath, './build/my-crawler-script'),
        crawlerMatch: /[/|\\]my-crawlers[/|\\].*\.js$/,
        crawlerInjectJQuery: false,
        screenshotPath: './build/my-screenshot',
        coveragePath: './build/my-coverage_output',
        isDevBuild: true,
      }) as MatmanConfigOpts;

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

    it('findMatmanConfig(data/fixtures/demo-has-config) for matman.config.js', () => {
      const demoRoot = path.join(__dirname, '../../data/fixtures/demo-has-config');
      const caseModuleFile = path.join(demoRoot, './c1.js');
      const matmanConfig = findMatmanConfig(caseModuleFile) as MatmanConfigOpts;

      expect(matmanConfig.rootPath).to.equal(demoRoot);
      expect(matmanConfig.caseModulesPath).to.equal(demoRoot);
    });

    it('findMatmanConfig(data/fixtures/demo-has-config) for matman.config.js and rewrite rootPath', () => {
      const demoRoot = path.join(__dirname, '../../data/fixtures/demo-has-config');
      const caseModuleFile = path.join(demoRoot, './c1.js');
      const matmanConfig = findMatmanConfig(caseModuleFile, {
        rootPath: path.join(demoRoot, '../'),
      }) as MatmanConfigOpts;

      expect(matmanConfig.rootPath).to.equal(path.join(demoRoot, '../'));
      expect(matmanConfig.caseModulesPath).to.equal(path.join(demoRoot, '../'));
    });

    it('findMatmanConfig(data/fixtures/demo-config-no-root-path) for matman.config.js without rootPath', () => {
      const demoRoot = path.join(__dirname, '../../data/fixtures/demo-config-no-root-path');
      const caseModuleFile = path.join(demoRoot, './c1.js');
      const matmanConfig = findMatmanConfig(caseModuleFile) as MatmanConfigOpts;

      expect(matmanConfig.rootPath).to.equal(demoRoot);
      expect(matmanConfig.caseModulesPath).to.equal(demoRoot);
    });

    it('findMatmanConfig(data/fixtures/demo-only-package) for package.json', () => {
      const demoRoot = path.join(__dirname, '../../data/fixtures/demo-only-package');
      const caseModuleFile = path.join(demoRoot, './c1.js');
      const matmanConfig = findMatmanConfig(caseModuleFile) as MatmanConfigOpts;

      expect(matmanConfig.rootPath).to.equal(demoRoot);
      expect(matmanConfig.caseModulesPath).to.equal(demoRoot);
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
