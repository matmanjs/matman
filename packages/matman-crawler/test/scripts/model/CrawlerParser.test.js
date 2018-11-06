const path = require('path');
const chai = require('chai');
const expect = chai.expect;

const CrawlerParser = require('../../../lib/model/CrawlerParser').default;

describe('./mocker/CrawlerParser.js', () => {

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
            expect(crawlerParser.crawlerMatch).to.eql(/crawlers[\/|\\].*\.js$/);
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
                crawlerMatch: /my-crawlers[\/|\\].*\.js$/,
                isDevBuild: true
            });

            expect(crawlerParser.check().result).to.be.true;
            expect(crawlerParser.rootPath).to.equal(rootPath);
            expect(crawlerParser.testPath).to.equal(path.join(rootPath, './src'));
            expect(crawlerParser.crawlerBuildPath).to.equal(path.join(rootPath, './build/my-crawler-script_dev'));
            expect(crawlerParser.screenshotPath).to.equal(path.join(rootPath, './build/my-screenshot'));
            expect(crawlerParser.crawlerMatch).to.eql(/my-crawlers[\/|\\].*\.js$/);
            expect(crawlerParser.isDevBuild).to.be.true;
        });

    });

    // describe('check getAllMocker', () => {
    //     let crawlerParser;
    //     before(() => {
    //         crawlerParser = new CrawlerParser({
    //             basePath: path.resolve(__dirname, '../../data/fixtures/mock_server/mockers')
    //         });
    //
    //         // console.log(mockerParser);
    //     });
    //
    //     it('should exist 4 members', () => {
    //         expect(allMocker).to.have.lengthOf(4);
    //     });
    //
    //     it('should contain correct mocker', () => {
    //         expect(allMocker.map(item => item.name)).to.have.members(['demo_01', 'demo_02_renamed', 'demo_03', 'async_01']);
    //     });
    // });

});

