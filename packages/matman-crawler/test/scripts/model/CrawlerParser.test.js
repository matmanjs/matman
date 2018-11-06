const path = require('path');
const chai = require('chai');
const fse = require('fs-extra');

const expect = chai.expect;

const CrawlerParser = require('../../../lib/model/CrawlerParser').default;
const build = require('../../../lib/build').default;

describe('./model/CrawlerParser.js', () => {

    describe('check construction', () => {
        it('if params is undefined', () => {
            let checkResult = new CrawlerParser().check();

            expect(checkResult.result).to.be.false;
            expect(checkResult.msg).to.match(/Unknown rootPath=.*/);
        });

        it('if params.rootPath is not exist', () => {
            let checkResult = new CrawlerParser({ rootPath: 'not/exist/rootPath' }).check();

            expect(checkResult.result).to.be.false;
            expect(checkResult.msg).to.match(/Unknown rootPath=.*not\/exist\/rootPath/);
        });

        it('if params.testPath is not exist', () => {
            let checkResult = new CrawlerParser({ rootPath: __dirname, testPath: 'not/exist/testPath' }).check();

            expect(checkResult.result).to.be.false;
            expect(checkResult.msg).to.match(/Unknown testPath=.*not\/exist\/testPath/);
        });

        it('check demo1: default value', () => {
            let rootPath = path.join(__dirname, '../../data/fixtures/demo1');
            let crawlerParser = new CrawlerParser({ rootPath: rootPath });

            expect(crawlerParser.check().result).to.be.true;
            expect(crawlerParser.rootPath).to.equal(rootPath);
            expect(crawlerParser.testPath).to.equal(path.join(rootPath, './e2e_test'));
            expect(crawlerParser.crawlerBuildPath).to.equal(path.join(rootPath, './build/crawler-script'));
            expect(crawlerParser.screenshotPath).to.equal(path.join(rootPath, './build/screenshot'));
            expect(crawlerParser.crawlerMatch).to.eql(/[\/|\\]crawlers[\/|\\].*\.js$/);
            expect(crawlerParser.isDevBuild).to.be.false;

            expect(crawlerParser).to.have.all.keys('rootPath', 'testPath', 'crawlerBuildPath', 'screenshotPath', 'crawlerMatch', 'isDevBuild');
        });

        it('check demo2: custom value', () => {
            let rootPath = path.join(__dirname, '../../data/fixtures/demo2');

            let crawlerParser = new CrawlerParser({
                rootPath: rootPath,
                testPath: './src',
                crawlerBuildPath: path.join(rootPath, './build/my-crawler-script'),
                screenshotPath: './build/my-screenshot',
                crawlerMatch: /[\/|\\]my-crawlers[\/|\\].*\.js$/,
                isDevBuild: true
            });

            expect(crawlerParser.check().result).to.be.true;
            expect(crawlerParser.rootPath).to.equal(rootPath);
            expect(crawlerParser.testPath).to.equal(path.join(rootPath, './src'));
            expect(crawlerParser.crawlerBuildPath).to.equal(path.join(rootPath, './build/my-crawler-script_dev'));
            expect(crawlerParser.screenshotPath).to.equal(path.join(rootPath, './build/my-screenshot'));
            expect(crawlerParser.crawlerMatch).to.eql(/[\/|\\]my-crawlers[\/|\\].*\.js$/);
            expect(crawlerParser.isDevBuild).to.be.true;
        });
    });

    describe('check getEntry()', () => {
        it('check demo1: getEntry()', () => {
            let rootPath = path.join(__dirname, '../../data/fixtures/demo1');
            let crawlerParser = new CrawlerParser({ rootPath: rootPath });
            let entry = crawlerParser.getEntry();

            expect(entry).to.eql({
                'crawlers/c1': path.join(crawlerParser.testPath, 'crawlers/c1.js'),
                'crawlers/c2': path.join(crawlerParser.testPath, 'crawlers/c2.js'),
                'p1/crawlers/c1': path.join(crawlerParser.testPath, 'p1/crawlers/c1.js'),
                'p1/crawlers/p11': path.join(crawlerParser.testPath, 'p1/crawlers/p11.js'),
                'p1/crawlers/p12': path.join(crawlerParser.testPath, 'p1/crawlers/p12.js')
            });

        });
    });

    describe('check getPath(name)', () => {
        let rootPath = path.join(__dirname, '../../data/fixtures/demo1');
        let tmpCrawlerBuildPath = path.join(__dirname, '../../data/tmp/demo1_getPath');

        let crawlerParser;

        before(() => {
            fse.removeSync(tmpCrawlerBuildPath);

            return build({
                rootPath: rootPath,
                crawlerBuildPath: tmpCrawlerBuildPath
            })
                .then((data) => {
                    crawlerParser = new CrawlerParser({
                        rootPath: rootPath,
                        crawlerBuildPath: tmpCrawlerBuildPath
                    });
                    return data;
                });
        });

        after(() => {
            fse.removeSync(tmpCrawlerBuildPath);
        });

        it('check demo1: getPath(name)', () => {
            let result = crawlerParser.getPath('crawlers/c1');

            expect(result).to.equal(path.join(crawlerParser.crawlerBuildPath, 'crawlers/c1.js'));
        });
    });

});

