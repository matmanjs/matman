import fs from 'fs';
import path from 'path';

/**
 * 获得绝对路径地址
 *
 * @param {String} targetPath 目标路径
 * @param {String} [basePath] 根路径
 * @return {String}
 */
export function getAbsolutePath(targetPath, basePath) {
    if (!targetPath) {
        return '';
    }

    if (path.isAbsolute(targetPath)) {
        return targetPath;
    }

    return basePath ? path.resolve(basePath, targetPath) : path.resolve(targetPath);
}

/**
 * 爬虫脚本类，用于处理所有的前端爬虫脚本
 */
export default class MatmanConfig {
    /**
     * 构造函数
     *
     * @param {String} rootPath  项目的根目录
     * @param {Object} opts 参数
     * @param {String} [opts.testerPath] 测试对象的根目录
     * @param {String} [opts.testPath] 即将废弃，同 testerPath
     * @param {String} [opts.crawlerBuildPath] 前端爬虫脚本构建之后的目录
     * @param {RegExp} [opts.crawlerMatch] 用于匹配是否为前端爬虫脚本的正则表达式
     * @param {Boolean} [opts.crawlerInjectJQuery] 前端爬虫脚本中是否注入jQuery，默认值为 true
     * @param {String} [opts.screenshotPath] 屏幕截图保存的路径
     * @param {String} [opts.coveragePath] 覆盖率数据保存的路径
     * @param {Boolean} [opts.isDevBuild] 是否为开发模式
     */
    constructor(rootPath, opts = {}) {
        // 项目根目录
        this.rootPath = getAbsolutePath(rootPath);

        // 端对端测试代码的目录
        this.testerPath = getAbsolutePath(opts.testerPath || opts.testPath || './src/testers', this.rootPath);

        // crawler script 构建之后的目录
        this.crawlerBuildPath = getAbsolutePath(opts.crawlerBuildPath || './build/crawler-script', this.rootPath);

        // 用于匹配是否为 crawler script 的正则
        this.crawlerMatch = opts.crawlerMatch || /[\/|\\]crawlers[\/|\\].*\.js$/;

        // 前端爬虫脚本中是否注入jQuery，默认值为 true
        this.crawlerInjectJQuery = (typeof opts.crawlerInjectJQuery === 'boolean' ? opts.crawlerInjectJQuery : true);

        // 是否为开发模式
        this.isDevBuild = !!opts.isDevBuild;

        // 如果是开发模式下，则修改构建之后的路径，使之与原构建路径同目录，且文件夹增加 _dev 后缀
        if (this.isDevBuild) {
            this.crawlerBuildPath = path.join(path.dirname(this.crawlerBuildPath), path.basename(this.crawlerBuildPath) + '_dev');
        }

        // 屏幕截图保存的路径
        this.screenshotPath = getAbsolutePath(opts.screenshotPath || './build/screenshot', this.rootPath);
        this.coveragePath = getAbsolutePath(opts.coveragePath || './build/coverage_output', this.rootPath);
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

        if (!fs.existsSync(this.testerPath)) {
            return {
                result: false,
                msg: 'Unknown testerPath=' + this.testerPath
            };
        }

        return {
            result: true
        };
    }
}
