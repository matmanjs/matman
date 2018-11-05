import fs from 'fs';
import path from 'path';

import CrawlerParser from './CrawlerParser';
import BaseHandle from './BaseHandle';
import { getConfigFilePath } from '../util';

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

    /**
     * 适合交互行为的操作
     *
     * @param pageUrl
     * @param preloadClientScriptPath
     * @param opts
     * @param callAction
     * @returns {Promise<*>}
     */
    handleOperate(pageUrl, preloadClientScriptPath, opts = {}, callAction) {
        let baseHandle = new BaseHandle(pageUrl, preloadClientScriptPath, opts);

        // 用户的自定义行为
        if (typeof callAction === 'function') {
            callAction(baseHandle);
        }

        return baseHandle.getResult();
    }

    /**
     * 适合简单的页面扫描场景，无交互行为。
     *
     * @param pageUrl
     * @param preloadClientScriptPath
     * @param opts
     * @returns {Promise<*>}
     */
    handleScan(pageUrl, preloadClientScriptPath, opts) {
        return this.handleOperate(pageUrl, preloadClientScriptPath, opts, (testAction) => {
            // scan 行为是一种特殊的操作，因为它只有一个行为，且结果也不再是数组
            testAction.addAction(function (nightmareRun) {
                return nightmareRun.wait(opts.wait || 500);
            });
        })
            .then(function (result) {
                // 去掉这个nightmare的返回。目前他没有什么其他的用处，但是在 JSON.stringify 时会报错
                if (result.globalInfo && result.globalInfo.recorder && result.globalInfo.recorder.nightmare) {
                    delete result.globalInfo.recorder.nightmare;
                }

                // 由于此处返回的是一个元素的数组，不便于后续处理，因此需要转义为对象返回
                result.data = result.data[0];

                return result;
            });
    }

    _getBasePath(basePath) {
        let result = path.isAbsolute(basePath) ? basePath : path.resolve(basePath);

        if (!fs.existsSync(result)) {
            throw new Error('Unknown basePath=' + result);
        }

        return result;
    }
}
