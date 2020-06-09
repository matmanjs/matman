import path from 'path';
import {expect} from 'chai';

import MatmanConfig from '../../../src/model/MatmanConfig';

describe('check model/MatmanConfig.js', () => {
  describe('check constructor(rootPath, opts = {})', () => {
    it('if rootPath is undefined return false', () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(() => new MatmanConfig()).to.throw('Unknown rootPath=');
    });

    it('if rootPath is not exist return false', () => {
      expect(() => new MatmanConfig('not/exist/rootPath')).to.throw(
        `Unknown rootPath=${path.join(__dirname, '../../../not/exist/rootPath')}`,
      );
    });

    it('if params.caseModulesPath is not exist return false', () => {
      expect(
        () => new MatmanConfig(__dirname, {caseModulesPath: 'not/exist/caseModulesPath'}),
      ).to.throw(`Unknown caseModulesPath=${path.join(__dirname, 'not/exist/caseModulesPath')}`);
    });

    it('check demo1: default value', () => {
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
      );
    });

    it('check demo2: custom value', () => {
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
      );
    });
  });
});
