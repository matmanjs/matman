import fs from 'fs';
import path from 'path';

import CrawlerParser from './CrawlerParser';

import getConfigFilePath from '../util/get-config-file-path';

/**
 * 爬虫脚本类，用于处理所有的前端爬虫脚本
 */
export default class CaseParser {
    /**
     * 构造函数
     *
     * @param {String} basePath  项目的根目录
     * @param {Object} [opts] 参数
     */
    constructor(basePath, opts = {}) {
        // 项目根目录
        this.basePath = this._getBasePath(basePath);
    }

    /**
     * 获得指定脚本构建之后的本地绝对路径，以便后续加入到 nightmare 中执行
     *
     * @param {String} name 指定脚本
     * @return {String} 构建之后的本地绝对路径
     */
    getPreloadScriptPath(name) {
        // 获得 matman.config.js 的文件路径
        const configFilePath = getConfigFilePath(this.basePath);

        // 根据配置内容获得 crawlerParser 的对象
        const crawlerParser = new CrawlerParser(require(configFilePath));

        // 调用 crawlerParser 的方法获得该脚本的绝对路径
        return crawlerParser.getPath(name);
    }

    _getBasePath(basePath) {
        let result = path.isAbsolute(basePath) ? basePath : path.resolve(basePath);

        if (!fs.existsSync(result)) {
            throw new Error('Unknown basePath=' + result);
        }

        return result;
    }
}
