import path from 'path';
import 'mocha';
import {expect} from 'chai';
import fse from 'fs-extra';
import glob from 'glob';
import {findMatmanConfig, MatmanConfig, requireSync} from 'matman-core';

import {build} from '../../../src';
import CrawlerParser from '../../../src/model/CrawlerParser';
import webpack from 'webpack';

describe('check build()', () => {
  const rootPath = path.join(__dirname, '../../data/fixtures/demo_for_crawlers');
  const tmpCrawlerBuildPath = path.join(__dirname, '../../data/tmp/demo_for_crawlers_build');

  const crawlerParser = new CrawlerParser(
    findMatmanConfig(rootPath, {
      crawlerBuildPath: tmpCrawlerBuildPath,
    }) as MatmanConfig,
  );

  before(() => {
    fse.removeSync(tmpCrawlerBuildPath);

    return build(crawlerParser.matmanConfig);
  });

  after(() => {
    fse.removeSync(tmpCrawlerBuildPath);
  });

  it('build for 5 crawler script', () => {
    const globResult = glob.sync(path.resolve(tmpCrawlerBuildPath, './**/**.js'));

    expect(globResult).to.have.members([
      path.join(tmpCrawlerBuildPath, 'crawlers/c1.js'),
      path.join(tmpCrawlerBuildPath, 'crawlers/c2.js'),
      path.join(tmpCrawlerBuildPath, 'p1/crawlers/c1.js'),
      path.join(tmpCrawlerBuildPath, 'p1/crawlers/p11.js'),
      path.join(tmpCrawlerBuildPath, 'p1/crawlers/p12.js'),
    ]);
  });

  it('check webpack-config entry', () => {
    const config = requireSync(
      path.join(tmpCrawlerBuildPath, 'webpack-config'),
    ) as webpack.Configuration;

    const caseModulesPath = path.join(rootPath, './case_modules');

    expect(config.entry).to.eql({
      'crawlers/c1': path.join(caseModulesPath, 'crawlers/c1.js'),
      'crawlers/c2': path.join(caseModulesPath, 'crawlers/c2.js'),
      'p1/crawlers/c1': path.join(caseModulesPath, 'p1/crawlers/c1.js'),
      'p1/crawlers/p11': path.join(caseModulesPath, 'p1/crawlers/p11.js'),
      'p1/crawlers/p12': path.join(caseModulesPath, 'p1/crawlers/p12.js'),
    });
  });

  it('check webpack-config output', () => {
    const config = requireSync(
      path.join(tmpCrawlerBuildPath, 'webpack-config'),
    ) as webpack.Configuration;

    expect(config.output && config.output.filename).to.equal('[name].js');
    expect(config.output && config.output.path).to.equal(tmpCrawlerBuildPath);
  });
});
