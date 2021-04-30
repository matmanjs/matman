import path from 'path';
import 'mocha';
import { expect } from 'chai';
import fse from 'fs-extra';
import { findMatmanConfig, MatmanConfig } from 'matman-core';

import build from '../../../src/run-build/index';

describe('check run-build/index.ts', () => {
  const rootPath = path.join(__dirname, '../../data/fixtures/demo_for_crawlers');
  const tmpCrawlerBuildPath = path.join(__dirname, '../../data/tmp/demo_for_crawlers_build');

  describe('check isIPC', () => {
    const matmanConfig = findMatmanConfig(rootPath, {
      crawlerBuildPath: tmpCrawlerBuildPath,
    }) as MatmanConfig;

    it('build simple file when isIPC is true', () => {
      const entryPath = path.join(
        __dirname,
        '../../data/fixtures/demo_for_crawlers/case_modules/crawlers/simple-file.js',
      );
      const outputPath = path.join(
        __dirname,
        '../../data/expects/demo_for_crawlers/simple-file-isIPC.js.result',
      );
      return build(entryPath, { isIPC: true, matmanConfig }).then((result) => {
        expect(result).to.equal(fse.readFileSync(outputPath, { encoding: 'utf8' }));
      });
    });

    it('build simple file when isIPC is false', () => {
      const entryPath = path.join(
        __dirname,
        '../../data/fixtures/demo_for_crawlers/case_modules/crawlers/simple-file.js',
      );
      const outputPath = path.join(
        __dirname,
        '../../data/expects/demo_for_crawlers/simple-file.js.result',
      );
      return build(entryPath, { isIPC: false, matmanConfig }).then((result) => {
        expect(result).to.equal(fse.readFileSync(outputPath, { encoding: 'utf8' }));
      });
    });
  });

  describe('check matmanConfig', () => {
    const entryPath = path.join(
      __dirname,
      '../../data/fixtures/demo_for_crawlers/case_modules/crawlers/simple-file.js',
    );

    it('isDevBuild=false and crawlerInjectJQuery=false', () => {
      const matmanConfig = findMatmanConfig(rootPath, {
        crawlerBuildPath: tmpCrawlerBuildPath,
        isDevBuild: false,
        crawlerInjectJQuery: false,
      }) as MatmanConfig;

      const outputPath = path.join(
        __dirname,
        '../../data/expects/demo_for_crawlers/matman-config-not-dev-no-jquery.js.result',
      );
      return build(entryPath, { isIPC: false, matmanConfig }).then((result) => {
        expect(result).to.equal(fse.readFileSync(outputPath, { encoding: 'utf8' }));
      });
    });

    it('isDevBuild=false and crawlerInjectJQuery=true', () => {
      const matmanConfig = findMatmanConfig(rootPath, {
        crawlerBuildPath: tmpCrawlerBuildPath,
        isDevBuild: false,
        crawlerInjectJQuery: true,
      }) as MatmanConfig;

      const outputPath = path.join(
        __dirname,
        '../../data/expects/demo_for_crawlers/matman-config-not-dev-need-jquery.js.result',
      );
      return build(entryPath, { isIPC: false, matmanConfig }).then((result) => {
        expect(result).to.equal(fse.readFileSync(outputPath, { encoding: 'utf8' }));
      });
    });

    it('isDevBuild=true and crawlerInjectJQuery=false', () => {
      const matmanConfig = findMatmanConfig(rootPath, {
        crawlerBuildPath: tmpCrawlerBuildPath,
        isDevBuild: true,
        crawlerInjectJQuery: false,
      }) as MatmanConfig;

      const outputPath = path.join(
        __dirname,
        '../../data/expects/demo_for_crawlers/matman-config-is-dev-no-jquery.js.result',
      );
      return build(entryPath, { isIPC: false, matmanConfig }).then((result) => {
        expect(result).to.equal(fse.readFileSync(outputPath, { encoding: 'utf8' }));
      });
    });

    it('isDevBuild=true and crawlerInjectJQuery=true', () => {
      const matmanConfig = findMatmanConfig(rootPath, {
        crawlerBuildPath: tmpCrawlerBuildPath,
        isDevBuild: true,
        crawlerInjectJQuery: true,
      }) as MatmanConfig;

      const outputPath = path.join(
        __dirname,
        '../../data/expects/demo_for_crawlers/matman-config-is-dev-need-jquery.js.result',
      );
      return build(entryPath, { isIPC: false, matmanConfig }).then((result) => {
        expect(result).to.equal(fse.readFileSync(outputPath, { encoding: 'utf8' }));
      });
    });
  });
});
