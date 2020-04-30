import path from 'path';
import { expect } from 'chai';

import CrawlerParser from '../../../src/model/CrawlerParser';
import { findMatmanConfig } from '../../../../matman/src/util';
// import fse from 'fs-extra';

describe('check CrawlerParser', () => {
    describe('check construction', () => {
        const matmanConfig = findMatmanConfig(path.join(__dirname, '../../data/fixtures/demo1'));

        it('check matmanConfig', () => {
            expect(new CrawlerParser(matmanConfig).matmanConfig).to.eql(matmanConfig);
        });
    });

    describe('check getEntry()', () => {
        it('check demo1: getEntry()', () => {
            const matmanConfig = findMatmanConfig(path.join(__dirname, '../../data/fixtures/demo1'));
            const crawlerParser = new CrawlerParser(matmanConfig);
            const entry = crawlerParser.getEntry();

            expect(entry).to.eql({
                'crawlers/c1': path.join(crawlerParser.matmanConfig.testerPath, 'crawlers/c1.js'),
                'crawlers/c2': path.join(crawlerParser.matmanConfig.testerPath, 'crawlers/c2.js'),
                'p1/crawlers/c1': path.join(crawlerParser.matmanConfig.testerPath, 'p1/crawlers/c1.js'),
                'p1/crawlers/p11': path.join(crawlerParser.matmanConfig.testerPath, 'p1/crawlers/p11.js'),
                'p1/crawlers/p12': path.join(crawlerParser.matmanConfig.testerPath, 'p1/crawlers/p12.js')
            });
        });
    });

    describe('check getEntryName(fullPath)', () => {
        const matmanConfig = findMatmanConfig(path.join(__dirname, '../../data/fixtures/demo1'));
        const crawlerParser = new CrawlerParser(matmanConfig);

        it('check demo1: getEntry(crawler script)', () => {
            expect(crawlerParser.getEntryName(path.join(crawlerParser.matmanConfig.testerPath, 'crawlers/c1.js'))).to.equal('crawlers/c1');
        });

        it('check demo1: getEntry(not crawler script)', () => {
            expect(crawlerParser.getEntryName(path.join(crawlerParser.matmanConfig.testerPath, 'q1/c1.js'))).to.equal('q1/c1');
        });
    });

    // describe('check getCrawlerScriptPathByName(name)', () => {
    //     let rootPath = path.join(__dirname, '../../data/fixtures/demo1');
    //     let tmpCrawlerBuildPath = path.join(__dirname, '../../data/tmp/demo1_getCrawlerScriptPathByName');
    //
    //     let crawlerParser;
    //
    //     before(() => {
    //         fse.removeSync(tmpCrawlerBuildPath);
    //
    //         return build(rootPath, {
    //             crawlerBuildPath: tmpCrawlerBuildPath
    //         })
    //             .then((data) => {
    //                 crawlerParser = new CrawlerParser(rootPath, {
    //                     crawlerBuildPath: tmpCrawlerBuildPath
    //                 });
    //                 return data;
    //             });
    //     });
    //
    //     after(() => {
    //         fse.removeSync(tmpCrawlerBuildPath);
    //     });
    //
    //     it('check demo1: getCrawlerScriptPathByName(name)', () => {
    //         let result = crawlerParser.getCrawlerScriptPathByName('crawlers/c1');
    //
    //         expect(result).to.equal(path.join(crawlerParser.crawlerBuildPath, 'crawlers/c1.js'));
    //     });
    // });

});

