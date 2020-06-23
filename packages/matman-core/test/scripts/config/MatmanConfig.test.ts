import path from 'path';
import 'mocha';
import {expect} from 'chai';

import MatmanConfig from '../../../src/config/MatmanConfig';

describe('check config/MatmanConfig.js', function () {
  describe('check constructor(rootPath, opts = {})', function () {
    it('if rootPath is undefined return false', function () {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(() => new MatmanConfig()).to.throw('Unknown rootPath=');
    });

    it('if rootPath is not exist return false', function () {
      expect(() => new MatmanConfig('/not/exist/rootPath')).to.throw(
        `Unknown rootPath=/not/exist/rootPath`,
      );
    });

    it('if params.caseModulesPath is not exist then set it equal rootPath', function () {
      const matmanConfig = new MatmanConfig(__dirname, {
        caseModulesPath: '/not/exist/caseModulesPath',
      });

      expect(matmanConfig.caseModulesPath).to.eql(__dirname);
      expect(matmanConfig.caseModulesPath).to.eql(matmanConfig.rootPath);
    });

    it('check demo1: default value', function () {
      const rootPath = path.join(__dirname, '../../data/fixtures/demo1');

      const matmanConfig = new MatmanConfig(rootPath);

      expect(matmanConfig.rootPath).to.equal(rootPath);
      expect(matmanConfig.caseModulesPath).to.equal(path.join(rootPath, './case_modules'));
      expect(matmanConfig.crawlerBuildPath).to.equal(path.join(rootPath, './build/crawler-script'));
      expect(matmanConfig.crawlerMatch).to.eql(/[/|\\]crawlers[/|\\].*\.js$/);
      expect(matmanConfig.crawlerInjectJQuery).to.be.false;
      expect(matmanConfig.isDevBuild).to.be.false;
      expect(matmanConfig.screenshotPath).to.equal(
        path.join(rootPath, './build/screenshot_output'),
      );
      expect(matmanConfig.coveragePath).to.equal(path.join(rootPath, './build/coverage_output'));

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
        'setupOptions',
      );
    });

    it('check demo2: custom value', function () {
      const rootPath = path.join(__dirname, '../../data/fixtures/demo2');

      const matmanConfig = new MatmanConfig(rootPath, {
        caseModulesPath: './my_case_modules',
        crawlerBuildPath: path.join(rootPath, './build/my-crawler-script'),
        crawlerMatch: /[/|\\]my-crawlers[/|\\].*\.js$/,
        crawlerInjectJQuery: true,
        screenshotPath: './build/my-screenshot',
        coveragePath: './build/my-coverage_output',
        isDevBuild: true,
      });

      expect(matmanConfig.rootPath).to.equal(rootPath);
      expect(matmanConfig.caseModulesPath).to.equal(path.join(rootPath, './my_case_modules'));
      expect(matmanConfig.crawlerBuildPath).to.equal(
        path.join(rootPath, './build/my-crawler-script_dev'),
      );
      expect(matmanConfig.crawlerMatch).to.eql(/[/|\\]my-crawlers[/|\\].*\.js$/);
      expect(matmanConfig.crawlerInjectJQuery).to.be.true;
      expect(matmanConfig.isDevBuild).to.be.true;
      expect(matmanConfig.screenshotPath).to.equal(path.join(rootPath, './build/my-screenshot'));
      expect(matmanConfig.coveragePath).to.equal(path.join(rootPath, './build/my-coverage_output'));

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
        'setupOptions',
      );
    });
  });
});
