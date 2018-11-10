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
        this.crawlerMatch = opts.crawlerMatch || /[\/|\\]crawlers[\/|\\].*\.js$/;

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

    /**
     * 获得 webpack 中的 entry 配置
     */
    getEntry() {
        let entry = {};

        // 获取所有的 js 文件
        let globResult = glob.sync(path.resolve(this.testPath, './**/**.js'));

        globResult
            .filter((item) => {
                // 过滤出符合条件的 js 文件
                return item.match(this.crawlerMatch);
            })
            .forEach((item) => {
                entry[this.getEntryName(item)] = item;
            });

        return entry;
    }

    /**
     * 通过一个源文件路径，获得其 entry 对象的名字
     *
     * @param {String} fullPath 源文件的绝对路径
     * @return {String}
     */
    getEntryName(fullPath) {
        // 获取相对于 testPath 的相对路径，且去掉 .js 后缀
        return path.relative(this.testPath, fullPath).replace('.js', '');
    }

    /**
     * 通过 crawler script 的源文件路径获得其构建之后的路径
     *
     * @param {String} srcPath 构建之前的路径
     * @return {String}
     */
    getCrawlerScriptPath(srcPath) {
        return this.getCrawlerScriptPathByName(this.getEntryName(srcPath));
    }

    /**
     * 通过 entry.name 值来获得构建之后的路径
     *
     * @param {String} entryName webpack中的entry.name值
     * @return {string}
     */
    getCrawlerScriptPathByName(entryName) {
        let result = '';

        try {
            let webpackConfig = require(path.resolve(this.crawlerBuildPath, './webpack-config'));
            result = path.join(webpackConfig.output.path, webpackConfig.output.filename.replace('[name]', entryName));

            // 如果替换之后的本地文件路径不存在，则将其置空
            if (!fs.existsSync(result)) {
                console.error('getPath() return unknown path', result);
                result = '';
            }
        } catch (err) {
            console.error('getPath() catch err', entryName, err);
        }

        return result;
    }

    _getRootPath(rootPath) {
        return rootPath ? (path.isAbsolute(rootPath) ? rootPath : path.resolve(rootPath)) : '';
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
