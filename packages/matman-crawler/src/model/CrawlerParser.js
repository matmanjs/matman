import fs from 'fs';
import path from 'path';
import glob from 'glob';

/**
 * 爬虫脚本类，用于处理所有的前端爬虫脚本
 */
export default class CrawlerParser {
    /**
     * 构造函数
     *
     * @param {Object} opts 参数
     * @param {String} opts.rootPath  项目的根目录
     * @param {String} [opts.testPath] 端对端测试代码的目录
     * @param {String} [opts.crawlerBuildPath] crawler script 构建之后的目录
     * @param {RegExp} [opts.crawlerMatch] 用于匹配是否为 crawler script 的正则
     * @param {RegExp} [opts.screenshotPath] 屏幕截图保存的路径
     * @param {Boolean} [opts.isDevBuild] 是否为开发模式
     */
    constructor(opts = {}) {
        // 项目根目录
        this.rootPath = this._getRootPath(opts.rootPath);

        // 端对端测试代码的目录
        this.testPath = this._getTestPath(opts.testPath || './e2e_test');

        // crawler script 构建之后的目录
        this.crawlerBuildPath = this._getCrawlerBuildPath(opts.crawlerBuildPath || './build/crawler-script');

        // 用于匹配是否为 crawler script 的正则
        this.crawlerMatch = opts.crawlerMatch || /crawlers[\/|\\].*\.js$/;

        this.isDevBuild = !!opts.isDevBuild;

        // 如果是开发模式下，则修改构建之后的路径，使之与原构建路径同目录，且文件夹增加 _dev 后缀
        if (this.isDevBuild) {
            this.crawlerBuildPath = path.join(path.dirname(this.crawlerBuildPath), path.basename(this.crawlerBuildPath) + '_dev');
        }

        // 屏幕截图保存的路径
        this.screenshotPath = this._getScreenshotPath(opts.screenshotPath || './build/screenshot');
    }

    /**
     * 校验参数是否合法有效
     *
     * @return {{result:Boolean, [msg]:String}}
     */
    check() {
        if (!fs.existsSync(this.rootPath)) {
            return {
                result: false,
                msg: 'Unknown rootPath=' + this.rootPath
            };
        }

        if (!fs.existsSync(this.testPath)) {
            return {
                result: false,
                msg: 'Unknown testPath=' + this.testPath
            };
        }

        return {
            result: true
        };
    }

    getEntry() {
        let entry = {};

        let globResult = glob.sync(path.resolve(this.testPath, './**/**.js'));

        globResult.forEach((item) => {
            let matchResult = item.match(this.crawlerMatch);

            if (matchResult) {
                let entryScript = item.match(new RegExp('/([^/]*/' + matchResult[0] + ')', 'i'))[1];
                let entryName = entryScript.replace('.js', '');

                entry[entryName] = item;
            }
        });

        return entry;
    }

    getPath(name) {
        const webpackConfig = require(path.resolve(this.crawlerBuildPath, './webpack-config'));

        return path.join(webpackConfig.output.path, webpackConfig.output.filename.replace('[name]', name));
    }

    _getRootPath(rootPath) {
        return path.isAbsolute(rootPath) ? rootPath : path.resolve(rootPath);
    }

    _getTestPath(testPath) {
        return path.isAbsolute(testPath) ? testPath : path.join(this.rootPath, testPath);
    }

    _getCrawlerBuildPath(crawlerBuildPath) {
        return path.isAbsolute(crawlerBuildPath) ? crawlerBuildPath : path.join(this.rootPath, crawlerBuildPath);
    }

    _getScreenshotPath(screenshotPath) {
        return path.isAbsolute(screenshotPath) ? screenshotPath : path.join(this.rootPath, screenshotPath);
    }
}
