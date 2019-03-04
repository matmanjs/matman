const path = require('path');
const chai = require('chai');
const fse = require('fs-extra');
const glob = require('glob');
const expect = chai.expect;

const build = require('../../../lib/run-build').default;

describe('./build/index.js', () => {
    let rootPath = path.join(__dirname, '../../data/fixtures/demo1');
    let tmpCrawlerBuildPath = path.join(__dirname, '../../data/tmp/demo1_build');

    before(() => {
        fse.removeSync(tmpCrawlerBuildPath);

        return build(rootPath, {
            crawlerBuildPath: tmpCrawlerBuildPath
        });
    });

    after(() => {
        fse.removeSync(tmpCrawlerBuildPath);
    });

    it('build for 5 crawler script', () => {
        let globResult = glob.sync(path.resolve(tmpCrawlerBuildPath, './**/**.js'));

        expect(globResult).to.have.members([
            path.join(tmpCrawlerBuildPath, 'crawlers/c1.js'),
            path.join(tmpCrawlerBuildPath, 'crawlers/c2.js'),
            path.join(tmpCrawlerBuildPath, 'p1/crawlers/c1.js'),
            path.join(tmpCrawlerBuildPath, 'p1/crawlers/p11.js'),
            path.join(tmpCrawlerBuildPath, 'p1/crawlers/p12.js')
        ]);
    });

    it('check webpack-config entry', () => {
        let config = require(path.join(tmpCrawlerBuildPath, 'webpack-config'));

        let testerPath = path.join(rootPath, './src/testers');

        expect(config.entry).to.eql({
            'crawlers/c1': path.join(testerPath, 'crawlers/c1.js'),
            'crawlers/c2': path.join(testerPath, 'crawlers/c2.js'),
            'p1/crawlers/c1': path.join(testerPath, 'p1/crawlers/c1.js'),
            'p1/crawlers/p11': path.join(testerPath, 'p1/crawlers/p11.js'),
            'p1/crawlers/p12': path.join(testerPath, 'p1/crawlers/p12.js')
        });
    });

    it('check webpack-config output', () => {
        let config = require(path.join(tmpCrawlerBuildPath, 'webpack-config'));

        expect(config.output.filename).to.equal('[name].js');
        expect(config.output.path).to.equal(tmpCrawlerBuildPath);
    });

});

