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

        it('rootPath existt', () => {
            let checkResult = new CrawlerParser({ rootPath: __dirname, testPath: 'not/exist/testPath' }).check();

            expect(checkResult.result).to.be.false;
            expect(checkResult.msg).to.match(/Unknown testPath=.*not\/exist\/testPath/);
        });
        // it('should contain some fields', () => {
        //     expect(crawlerParser).to.have.all.keys('basePath', 'definedMockers');
        // });
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

