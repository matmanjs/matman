import path from 'path';
import 'mocha';
import {expect} from 'chai';
import fse from 'fs-extra';

import CrawlerParser from '../../../src/model/CrawlerParser';
import {build} from '../../../src/index';
import {findMatmanConfig} from 'matman-core';

describe('check CrawlerParser', () => {
  describe('check construction', async () => {
    const matmanConfig = (await findMatmanConfig(
      path.join(__dirname, '../../data/fixtures/demo_for_crawlers'),
    )) as any;

    it('check matmanConfig', () => {
      if (matmanConfig) {
        expect(new CrawlerParser(matmanConfig).matmanConfig).to.eql(matmanConfig);
      }
      expect(matmanConfig).not.to.be.null;
    });
  });

  describe('check getEntry()', () => {
    it('check demo1: getEntry()', async () => {
      const matmanConfig = (await findMatmanConfig(
        path.join(__dirname, '../../data/fixtures/demo_for_crawlers'),
      )) as any;
      if (matmanConfig === null) {
        expect(matmanConfig).not.to.be.null;
      } else {
        const crawlerParser = new CrawlerParser(matmanConfig);
        const entry = crawlerParser.getEntry();

        expect(entry).to.eql({
          'crawlers/c1': path.join(crawlerParser.matmanConfig.caseModulesPath, 'crawlers/c1.js'),
          'crawlers/c2': path.join(crawlerParser.matmanConfig.caseModulesPath, 'crawlers/c2.js'),
          'p1/crawlers/c1': path.join(
            crawlerParser.matmanConfig.caseModulesPath,
            'p1/crawlers/c1.js',
          ),
          'p1/crawlers/p11': path.join(
            crawlerParser.matmanConfig.caseModulesPath,
            'p1/crawlers/p11.js',
          ),
          'p1/crawlers/p12': path.join(
            crawlerParser.matmanConfig.caseModulesPath,
            'p1/crawlers/p12.js',
          ),
        });
      }
    });
  });

  describe('check getCrawlerScriptPath(name)', async () => {
    const rootPath = path.join(__dirname, '../../data/fixtures/demo_for_crawlers');
    const tmpCrawlerBuildPath = path.join(__dirname, '../../data/tmp/demo1_getCrawlerScriptPath');

    const crawlerParser = new CrawlerParser(
      (await findMatmanConfig(rootPath, {
        crawlerBuildPath: tmpCrawlerBuildPath,
      })) as any,
    );

    before(() => {
      fse.removeSync(tmpCrawlerBuildPath);

      return build(crawlerParser.matmanConfig);
    });

    after(() => {
      fse.removeSync(tmpCrawlerBuildPath);
    });

    it('if file exist then return build path result', async () => {
      const result = await crawlerParser.getCrawlerScriptPath(
        path.join(rootPath, './case_modules/crawlers/c1.js'),
      );

      expect(result).to.equal(path.join(tmpCrawlerBuildPath, 'crawlers/c1.js'));
    });

    it('if file not exist then return ""', async () => {
      const result = await crawlerParser.getCrawlerScriptPath(
        path.join(rootPath, './case_modules/crawlers/not-exist-file.js'),
      );

      expect(result).to.be.empty;
    });
  });

  describe('check getEntryName(fullPath)', async () => {
    const matmanConfig = (await findMatmanConfig(
      path.join(__dirname, '../../data/fixtures/demo_for_crawlers'),
    )) as any;

    if (matmanConfig === null) {
      expect(matmanConfig).not.to.be.null;
    } else {
      const crawlerParser = new CrawlerParser(matmanConfig);

      it('check demo_for_crawlers: getEntry(crawler script)', () => {
        expect(
          crawlerParser.getEntryName(
            path.join(crawlerParser.matmanConfig.caseModulesPath, 'crawlers/c1.js'),
          ),
        ).to.equal('crawlers/c1');
      });

      it('check demo_for_crawlers: getEntry(not crawler script)', () => {
        expect(
          crawlerParser.getEntryName(
            path.join(crawlerParser.matmanConfig.caseModulesPath, 'q1/c1.js'),
          ),
        ).to.equal('q1/c1');
      });
    }
  });
});
