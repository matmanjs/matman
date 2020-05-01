import fs from 'fs';
import fse from 'fs-extra';
import path from 'path';

import _ from 'lodash';
import ScreenshotConfig from './ScreenshotConfig';
import DeviceConfig from './DeviceConfig';
import CaseParserOperateResult from './CaseParserOperateResult';
import NightmareMaster from './NightmareMaster';
import MatmanConfig from './MatmanConfig';
import { CrawlerParser } from 'matman-crawler';

/**
 * 测试用例处理类
 */
export default class PageDriver {
    /**
     * 构造函数
     *
     * @param {MatmanConfig} matmanConfig
     * @param {String} caseModuleFilePath  测试case文件的路径
     * @param {Object} [opts] 参数
     * @param {Object} [opts.delayBeforeRun] 延时多少ms再启动
     * @param {String} [opts.tag] 标记，在某些场景下追加
     * @param {Boolean} [opts.useRecorder] 是否使用记录器
     * @param {Boolean} [opts.doNotCloseBrowser] 是否在执行完成之后不要关闭浏览器，默认为 false
     */
    constructor(matmanConfig, caseModuleFilePath, opts = {}) {

        this.matmanConfig = matmanConfig;

        // 测试case文件的路径
        // TODO 需要确保存在
        this.caseModuleFilePath = caseModuleFilePath;

        this.useRecorder = opts.useRecorder;
        this.doNotCloseBrowser = opts.doNotCloseBrowser;

        this.tag = opts.tag;

        // 特殊处理：如果 this.tag 是存在的文件，则获取文件名
        if (this.tag && fs.existsSync(this.tag)) {
            this.tag = path.basename(this.tag).replace(/\./gi, '_');
        }

        // 延时多少ms再启动
        this.delayBeforeRun = (typeof opts.delayBeforeRun === 'number' ? opts.delayBeforeRun : 0);

        this.nightmareConfig = {};
        this.proxyServer = '';
        this.mockstarOpts = null;

        this.cookies = '';
        this.deviceConfig = null;
        this.screenshotConfig = null;
        this.coverageConfig = null;

        this.pageUrl = '';

        this.nightmareWaitFn = 500;
        this.nightmareWaitFnArgs = [];

        this.crawlerScriptPath = '';
        this.nightmareEvaluateFn = null;
        this.nightmareEvaluateFnArgs = [];

        this.actionList = [];

        this._dataIndexMap = {};
        this._isDefaultScanMode = false;
    }

    /**
     * 基于 nightmare.js 框架，未来可以扩展其他的端对端测试工具
     *
     * @param {Object || undefined} nightmareConfig 传递给原生的 Nightmare constructor 的参数
     * @return {PageDriver}
     */
    useNightmare(nightmareConfig) {
        this.nightmareConfig = nightmareConfig || {};

        return this;
    }

    /**
     * 走指定的代理服务，由代理服务配置请求加载本地项目，从而达到同源测试的目的
     * 若不配置，则之前请求现网，亦可直接测试现网的服务
     *
     * https://github.com/segmentio/nightmare#switches
     *
     * @param {String} proxyServer 代理服务器，类似 my_proxy_server.example.com:8080，例如 127.0.0.1:8899
     * @return {PageDriver}
     */
    useProxyServer(proxyServer) {
        this.proxyServer = proxyServer;

        return this;
    }

    /**
     * 支持动态设置本次请求动态设置规则，
     * 这样可以支持自定义的代理mock数据等场景
     *
     * @param opts
     * @return {PageDriver}
     */
    useWhistle(opts) {
        return this;
    }

    /**
     * 使用 mockstar 工具来做接口 mock 数据
     *
     * @param opts
     * @return {PageDriver}
     */
    useMockstar(opts) {
        this.mockstarOpts = opts;
        return this;
    }

    /**
     * 为浏览器注入cookie
     * 参考 https://github.com/helinjiang/nightmare-handler/tree/master/demo/extend-exCookies
     *
     * @param {String | Object } cookies
     * @return {PageDriver}
     */
    setCookies(cookies) {
        this.cookies = cookies;
        return this;
    }

    /**
     * 设置当前设备参数，有默认值
     *
     * @param deviceConfig
     * @return {PageDriver}
     */
    setDeviceConfig(deviceConfig) {
        this.deviceConfig = new DeviceConfig(deviceConfig || 'mobile');
        return this;
    }

    /**
     * 设置截屏，默认不截图
     *
     * @param {Boolean | String | Object} screenshotConfig
     * @return {PageDriver}
     */
    setScreenshotConfig(screenshotConfig) {
        if (screenshotConfig) {
            this.screenshotConfig = new ScreenshotConfig(this.matmanConfig, screenshotConfig, this.caseModuleFilePath, this.tag);

            // 要保证这个目录存在，否则保存时会报错
            fse.ensureDirSync(path.dirname(this.screenshotConfig.path));
        }
        return this;
    }

    /**
     * 设置覆盖率配置，有默认值
     *
     * @param coverageConfig
     * @return {PageDriver}
     */
    setCoverageConfig(coverageConfig) {
        this.coverageConfig = coverageConfig;
        return this;
    }

    /**
     * 加载页面地址
     *
     * @param pageUrl
     * @return {PageDriver}
     */
    goto(pageUrl) {
        this.pageUrl = pageUrl;
        return this;
    }

    run(actionName, actionCall) {
        if (typeof actionCall === 'function') {
            this.actionList.push(actionCall);
            this._dataIndexMap[actionName + ''] = this.actionList.length - 1;
        } else if (typeof actionName === 'function') {
            this.actionList.push(actionName);
        } else {
            throw new Error('addAction should assign function!');
        }

        return this;
    }

    /**
     * 执行爬虫脚本之前，需要等待某些条件达成，
     * 与 nightmare 的 wait 含义和用法一致
     *
     * @param {String | Function} fn
     * @param [args]
     * @return {PageDriver}
     */
    wait(fn, ...args) {
        this.nightmareWaitFn = fn;
        this.nightmareWaitFnArgs = args;

        return this;
    }

    /**
     * 执行爬虫脚本，
     * 这里要么是约定的相对路径，要么是绝对路径，只支持本地文件
     * TODO 需要支持原生的自定义函数脚本，这样在某些场景下可以不用单独写爬虫脚本
     *
     * @param {String | Function} fn
     * @param [args]
     * @return {PageDriver}
     */
    evaluate(fn, ...args) {
        if (typeof fn === 'string') {
            // 获取 crawler script 的源文件目录
            const crawlerScriptSrcPath = path.resolve(path.dirname(this.caseModuleFilePath), fn);

            // 调用 crawlerParser 的方法获得该脚本构建之后的路径
            this.nightmareEvaluateFn = new CrawlerParser(this.matmanConfig).getCrawlerScriptPath(crawlerScriptSrcPath);
        } else {
            this.nightmareEvaluateFn = fn;
            this.nightmareEvaluateFnArgs = args;
        }

        return this;
    }

    /**
     * 结束，获取结果
     * @return {Promise<{}>}
     */
    end() {
        let nightmareMaster = new NightmareMaster(this);

        // 用户的自定义行为
        // if (typeof callAction === 'function') {
        //     callAction(nightmareMaster);
        // }

        // 兼容没有定义 run 方法的场景
        if (!this.actionList.length) {
            this._isDefaultScanMode = true;
            this.run('_scan_page_', function (nightmareRun) {
                return nightmareRun.wait(500);
            });
        }

        return nightmareMaster.getResult()
            .then((resultData) => {
                return new CaseParserOperateResult(resultData);
            })
            .then((result) => {
                // 由于此处返回的是一个元素的数组，不便于后续处理，因此需要转义为对象返回
                if (this._isDefaultScanMode) {
                    result.data = result.get(0);
                }

                return result;
            });
    }

    /**
     * 执行自定义的方法，适用于 debug 和自定义扩展等场景
     *
     * @param customFn
     * @return {PageDriver}
     */
    executeCustomFn(customFn) {
        if (typeof customFn === 'function') {
            customFn(this);
        }
        return this;
    }
}
