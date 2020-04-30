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
     * @param {MatmanConfig} matmanConfig
     */
    constructor(matmanConfig) {
        // 项目根目录
        this.matmanConfig = matmanConfig;
    }

    /**
     * 获得 webpack 中的 entry 配置
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
        // 获取相对于 testerPath 的相对路径，且去掉 .js 后缀
        return path.relative(this.matmanConfig.testerPath, fullPath).replace('.js', '');
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
            let webpackConfig = require(path.resolve(this.matmanConfig.crawlerBuildPath, './webpack-config'));
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
}
