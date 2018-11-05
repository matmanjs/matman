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
     * @param {String} [opts.testPath] 测试代码的目录
     * @param {String} [opts.buildPath] crawler script 构建之后的目录
     * @param {RegExp} [opts.crawlerMatch] 用于匹配是否为 crawler script 的正则
     * @param {Boolean} [opts.isDevBuild] 是否为开发模式
     */
    constructor(opts = {}) {
        // 项目根目录
        this.rootPath = this._getRootPath(opts.rootPath);

        // 测试代码的目录
        this.testPath = this._getTestPath(opts.testPath || './e2e_test');

        // 设置默认值和绝对路径
        this.buildPath = this._getBuildPath(opts.buildPath || './build/client-script');

        // 用于匹配是否为 crawler script 的正则
        this.crawlerMatch = opts.crawlerMatch || /crawlers[\/|\\].*\.js$/;

        // 如果是开发模式下，则修改构建之后的路径，使之与原构建路径同目录，且文件夹增加 _dev 后缀
        if (opts.isDevBuild) {
            this.buildPath = path.join(path.dirname(this.buildPath), path.basename(this.buildPath) + '_dev');
        }
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
        const webpackConfig = require(path.resolve(this.buildPath, './webpack-config'));

        return path.join(webpackConfig.output.path, webpackConfig.output.filename.replace('[name]', name));
    }

    _getRootPath(rootPath) {
        let result = path.isAbsolute(rootPath) ? rootPath : path.resolve(rootPath);

        if (!fs.existsSync(result)) {
            throw new Error('Unknown rootPath=' + result);
        }

        return result;
    }

    _getTestPath(testPath) {
        let result = path.isAbsolute(testPath) ? testPath : path.join(this.rootPath, testPath);

        if (!fs.existsSync(result)) {
            throw new Error('Unknown testPath=' + result);
        }

        return result;
    }

    _getBuildPath(buildPath) {
        return path.isAbsolute(buildPath) ? buildPath : path.join(this.rootPath, buildPath);
    }
}
