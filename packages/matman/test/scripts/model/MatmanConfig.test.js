import path from 'path';
import { expect } from 'chai';

import MatmanConfig from '../../../src/model/MatmanConfig';

describe('check model/MatmanConfig.js', () => {
    describe('check constructor(rootPath, opts = {})', () => {
        it('if rootPath is undefined return false', () => {
            let checkResult = new MatmanConfig().check();

            expect(checkResult.result).to.be.false;
            expect(checkResult.msg).to.match(/Unknown rootPath=.*/);
        });

        it('if rootPath is not exist return false', () => {
            let checkResult = new MatmanConfig('not/exist/rootPath').check();

            expect(checkResult.result).to.be.false;
            expect(checkResult.msg).to.match(/Unknown rootPath=.*not\/exist\/rootPath/);
        });

        it('if params.testerPath is not exist return false', () => {
            let checkResult = new MatmanConfig(__dirname, { testerPath: 'not/exist/testerPath' }).check();

            expect(checkResult.result).to.be.false;
            expect(checkResult.msg).to.match(/Unknown testerPath=.*not\/exist\/testerPath/);
        });

        it('check demo1: default value', () => {
            let rootPath = path.join(__dirname, '../../data/fixtures/demo1');

            let matmanConfig = new MatmanConfig(rootPath);

            expect(matmanConfig.check().result).to.be.true;
            expect(matmanConfig.rootPath).to.equal(rootPath);
            expect(matmanConfig.testerPath).to.equal(path.join(rootPath, './src/testers'));
            expect(matmanConfig.crawlerBuildPath).to.equal(path.join(rootPath, './build/crawler-script'));
            expect(matmanConfig.crawlerMatch).to.eql(/[\/|\\]crawlers[\/|\\].*\.js$/);
            expect(matmanConfig.crawlerInjectJQuery).to.be.true;
            expect(matmanConfig.isDevBuild).to.be.false;
            expect(matmanConfig.screenshotPath).to.equal(path.join(rootPath, './build/screenshot_output'));
            expect(matmanConfig.coveragePath).to.equal(path.join(rootPath, './build/coverage_output'));

            expect(matmanConfig).to.have.all.keys('rootPath', 'testerPath', 'crawlerBuildPath', 'crawlerMatch', 'crawlerInjectJQuery', 'isDevBuild', 'matmanResultPath', 'screenshotPath', 'coveragePath');
        });

        it('check demo2: custom value', () => {
            let rootPath = path.join(__dirname, '../../data/fixtures/demo2');

            let matmanConfig = new MatmanConfig(rootPath, {
                testerPath: './src-testers',
                crawlerBuildPath: path.join(rootPath, './build/my-crawler-script'),
                crawlerMatch: /[\/|\\]my-crawlers[\/|\\].*\.js$/,
                crawlerInjectJQuery: false,
                screenshotPath: './build/my-screenshot',
                coveragePath: './build/my-coverage_output',
                isDevBuild: true
            });

            expect(matmanConfig.check().result).to.be.true;
            expect(matmanConfig.rootPath).to.equal(rootPath);
            expect(matmanConfig.testerPath).to.equal(path.join(rootPath, './src-testers'));
            expect(matmanConfig.crawlerBuildPath).to.equal(path.join(rootPath, './build/my-crawler-script_dev'));
            expect(matmanConfig.crawlerMatch).to.eql(/[\/|\\]my-crawlers[\/|\\].*\.js$/);
            expect(matmanConfig.crawlerInjectJQuery).to.be.false;
            expect(matmanConfig.isDevBuild).to.be.true;
            expect(matmanConfig.screenshotPath).to.equal(path.join(rootPath, './build/my-screenshot'));
            expect(matmanConfig.coveragePath).to.equal(path.join(rootPath, './build/my-coverage_output'));

            expect(matmanConfig).to.have.all.keys('rootPath', 'testerPath', 'crawlerBuildPath', 'crawlerMatch', 'crawlerInjectJQuery', 'isDevBuild', 'matmanResultPath', 'screenshotPath', 'coveragePath');
        });
    });
});

