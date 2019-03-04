import fs from 'fs';
import path from 'path';

import BaseHandle from './BaseHandle';
import ScreenshotConfig from './SceenshotConfig';
import DeviceConfig from './DeviceConfig';

import { findCrawlerParser } from '../util';

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
     * @param {String} relativePath 相对路径
     * @return {String} 构建之后的本地绝对路径，如果不存在则返回空字符串
     */
    getCrawlerScriptPath(relativePath) {
        // 根据配置内容获得 crawlerParser 的对象
        const crawlerParser = findCrawlerParser(this.basePath);

        // 有可能找不到
        if (!crawlerParser) {
            return '';
        }

        // 获取 crawler script 的源文件目录
        const crawlerScriptSrcPath = path.resolve(this.basePath, relativePath);

        // 调用 crawlerParser 的方法获得该脚本构建之后的路径
        return crawlerParser.getCrawlerScriptPath(crawlerScriptSrcPath);
    }

    /**
     * 适合交互行为的操作
     *
     * @param pageUrl
     * @param crawlerScriptPath
     * @param opts
     * @param callAction
     * @returns {Promise<*>}
     */
    handleOperate(pageUrl, crawlerScriptPath, opts = {}, callAction) {
        // 如果配置了截图，则需要特殊处理下
        if (opts.screenshot) {
            opts.screenshotConfig = new ScreenshotConfig((typeof opts.screenshot === 'object') ? opts.screenshot : {}, this.basePath);
        }

        // 设备信息，默认为 mobile
        opts.deviceConfig = new DeviceConfig(opts.device || 'mobile');

        let baseHandle = new BaseHandle(pageUrl, crawlerScriptPath, opts);

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
     * @param crawlerScriptPath
     * @param opts
     * @returns {Promise<*>}
     */
    handleScan(pageUrl, crawlerScriptPath, opts) {
        return this.handleOperate(pageUrl, crawlerScriptPath, opts, (testAction) => {
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
