import fs from 'fs';
import path from 'path';
import glob from 'glob';

/**
 * 爬虫脚本解析器，用于处理前端的爬虫脚本
 */
export default class CrawlerParser {
    /**
     * 构造函数
     *
     * @param {MatmanConfig} matmanConfig
     * @author helinjiang
     */
    constructor(matmanConfig) {
        // 项目根目录
        this.matmanConfig = matmanConfig;
    }

    /**
     * 获得 webpack 中的 entry 配置，用于构建之用
     *
     * @return {Object}
     * @author helinjiang
     */
    getEntry() {
        let entry = {};

        // 获取所有的 js 文件
        let globResult = glob.sync(path.resolve(this.matmanConfig.testerPath, './**/**.js'));

        globResult
            .filter((item) => {
                // 过滤出符合条件的 js 文件
                return item.match(this.matmanConfig.crawlerMatch);
            })
            .forEach((item) => {
                entry[this._getEntryName(item)] = item;
            });

        return entry;
    }

    /**
     * 通过 crawler script 的源文件路径获得其构建之后的文件路径
     *
     * @param {String} srcPath 构建之前的文件路径
     * @return {String} 构建之后的文件路径
     * @author helinjiang
     */
    getCrawlerScriptPath(srcPath) {
        const entryName = this._getEntryName(srcPath);

        let result = '';

        try {
            // 获得 webpack config 文件的内容
            const webpackConfig = require(path.resolve(this.matmanConfig.crawlerBuildPath, './webpack-config'));

            // 从 webpack config 中拼装出构建之后的路径
            result = path.join(webpackConfig.output.path, webpackConfig.output.filename.replace('[name]', entryName));

            // 如果替换之后的本地文件路径不存在，则将其置空
            if (!fs.existsSync(result)) {
                console.error(`getCrawlerScriptPath(${srcPath}) not exist build file`, result);
                result = '';
            }
        } catch (err) {
            console.error(`getCrawlerScriptPath(${srcPath}) catch err`, entryName, err);
        }

        return result;
    }

    /**
     * 根据完整的源文件绝对路径，反查其在 entry 中 key 值
     *
     * @param {String} fullPath 源文件的绝对路径
     * @return {String}
     * @author helinjiang
     * @private
     */
    _getEntryName(fullPath) {
        // 获取相对于 testerPath 的相对路径，且去掉 .js 后缀
        return path.relative(this.matmanConfig.testerPath, fullPath).replace('.js', '');
    }
}
