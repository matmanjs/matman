import fs from 'fs';
import fse from 'fs-extra';
import path from 'path';

import _ from 'lodash';

import BaseHandle from './BaseHandle';
import ScreenshotConfig from './ScreenshotConfig';
import DeviceConfig from './DeviceConfig';
import CoverageConfig from './CoverageConfig';
import CaseParserOperateResult from './CaseParserOperateResult';
import NightmareMaster from './NightmareMaster';
import MatmanConfig from './MatmanConfig';

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

        this.cookie = '';
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
     * 为浏览器注入cookie，格式与 document.cookie 一致
     *
     * @param cookie
     * @return {PageDriver}
     */
    setCookie(cookie) {
        this.cookie = cookie;
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
            this.crawlerScriptPath = fn;
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
            this.run('_load_page_', function (nightmareRun) {
                return nightmareRun.wait(500);
            });
        }

        return nightmareMaster.getResult()
            .then((resultData) => {
                return new CaseParserOperateResult(resultData);
            });
    }

    /**
     * 模拟用户进行交互操作
     *
     * @param {String} pageUrl 页面的 URL 地址
     * @param {String} crawlerScriptPath 运行在浏览器中的前端爬虫脚本，需要是绝对路径
     * @param {Object} [opts] 额外参数
     * @param {Boolean} [opts.show] 运行时的无头浏览器是否需要可见，默认为 false，即隐藏在后台运行
     * @param {String} [opts.proxyServer] 代理服务器，例如 127.0.0.1:8899
     * @param {String | Number} [opts.wait] wait配置，会直接透传给 nightmare 的 wait 配置项，详细请查看 https://github.com/segmentio/nightmare#waitms
     * @param {Boolean} [opts.doNotEnd] 是否在执行完成之后不要关闭浏览器，默认为 false
     * @param {String} [opts.cookie] 为浏览器注入cookie，格式与 document.cookie 一致
     * @param {Object} [opts.mockstarQuery] 指定 mockstar 的query参数，用于数据打桩
     * @param {Boolean} [opts.useRecorder] 是否使用记录器记录所有浏览器行为，包括请求等
     * @param {String | Boolean | Object} [opts.screenshot] 截图设置
     * @param {String | Object} [opts.deviceConfig] 设备设置
     * @param {String | Object} [opts.device] 设备设置，即将废弃
     * @param {String} [opts.tag] 额外标记，用于区分不同的执行，在截图等场景做区分
     * @param {Function} callAction 定义用户交互行为的函数，接受一个BaseHandle对象参数
     * @returns {Promise<*>}
     */
    _handleOperate(pageUrl, crawlerScriptPath, opts = {}, callAction) {
        let baseHandleOpts = _.merge({}, opts);

        // 如果配置了截图，则需要特殊处理下
        if (opts.screenshot) {
            baseHandleOpts.screenshotConfig = new ScreenshotConfig(opts.screenshot, this.basePath, opts.tag);
        }

        // 设备信息，默认为 mobile
        baseHandleOpts.deviceConfig = new DeviceConfig(opts.deviceConfig || opts.device || 'mobile');

        // 测试覆盖率
        baseHandleOpts.coverageConfig = new CoverageConfig(this.basePath, opts.tag);

        let baseHandle = new BaseHandle(pageUrl, crawlerScriptPath, baseHandleOpts);

        // 用户的自定义行为
        if (typeof callAction === 'function') {
            callAction(baseHandle);
        }

        return baseHandle.getResult()
            .then((resultData) => {
                return new CaseParserOperateResult(resultData);
            });
    }

    /**
     * 模拟用户进行交互操作
     *
     * @param {String} pageUrl 页面的 URL 地址
     * @param {String} crawlerScriptPath 运行在浏览器中的前端爬虫脚本，需要是绝对路径
     * @param {Object} [opts] 额外参数
     * @param {Boolean} [opts.show] 运行时的无头浏览器是否需要可见，默认为 false，即隐藏在后台运行
     * @param {String} [opts.proxyServer] 代理服务器，例如 127.0.0.1:8899
     * @param {String | Number} [opts.wait] wait配置，会直接透传给 nightmare 的 wait 配置项，详细请查看 https://github.com/segmentio/nightmare#waitms
     * @param {Boolean} [opts.doNotEnd] 是否在执行完成之后不要关闭浏览器，默认为 false
     * @param {String} [opts.cookie] 为浏览器注入cookie，格式与 document.cookie 一致
     * @param {Object} [opts.mockstarQuery] 指定 mockstar 的query参数，用于数据打桩
     * @param {Boolean} [opts.useRecorder] 是否使用记录器记录所有浏览器行为，包括请求等
     * @param {String | Boolean | Object} [opts.screenshot] 截图设置
     * @param {String | Object} [opts.deviceConfig] 设备设置
     * @param {String | Object} [opts.device] 设备设置
     * @param {Function} callAction 定义用户交互行为的函数，接受一个BaseHandle对象参数
     * @returns {Promise<*>}
     */
    handleOperate(pageUrl, crawlerScriptPath, opts = {}, callAction) {
        return new Promise((resolve, reject) => {
            if (this.delayBeforeRun) {
                console.log(`CaseParser will run after ${this.delayBeforeRun}ms`);
            }

            setTimeout(() => {
                this._handleOperate(pageUrl, crawlerScriptPath, opts, callAction)
                    .then((data) => {
                        resolve(data);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            }, this.delayBeforeRun);
        });
    }

    /**
     * 获取页面信息，适合无交互行为的场景
     *
     * @param pageUrl
     * @param crawlerScriptPath
     * @param opts
     * @param delayBeforeClose
     * @returns {Promise<*>}
     */
    handleScan(pageUrl, crawlerScriptPath, opts, delayBeforeClose) {
        return this.handleOperate(pageUrl, crawlerScriptPath, opts, (testAction) => {
            // scan 行为是一种特殊的操作，因为它只有一个行为，且结果也不再是数组
            testAction.addAction(function (nightmareRun) {
                let runResult = nightmareRun.wait(opts.wait || 500);

                // 如果启用了记录器，则需要延时结束，否则有些 cgi 场景可能会由于关闭太快而来不及收集 #149
                if (opts.useRecorder) {
                    runResult.wait(delayBeforeClose || 1000);
                }

                return runResult;
            });
        })
            .then(function (result) {
                // 由于此处返回的是一个元素的数组，不便于后续处理，因此需要转义为对象返回
                result.data = result.get(0);

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
