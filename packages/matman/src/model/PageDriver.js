import fs from 'fs';
import path from 'path';

import fse from 'fs-extra';
import _ from 'lodash';
import { CrawlerParser } from 'matman-crawler';

import MatmanResult from './MatmanResult';
import NightmareMaster from './NightmareMaster';
import MatmanConfig from './MatmanConfig';

import ScreenshotConfig from './ScreenshotConfig';
import DeviceConfig from './DeviceConfig';
import CoverageConfig from './CoverageConfig';
import MatmanResultConfig from './MatmanResultConfig';

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
        this.mockstarQuery = null;

        this.cookies = '';
        this.deviceConfig = null;
        this.screenshotConfig = null;
        this.coverageConfig = null;
        this.matmanResultConfig = null;

        this.pageUrl = '';

        this.nightmareWaitFn = 500;
        this.nightmareWaitFnArgs = [];

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
     * @author helinjiang
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
     * @author helinjiang
     */
    useProxyServer(proxyServer) {
        this.proxyServer = proxyServer;

        return this;
    }

    /**
     * TODO 支持动态设置本次请求动态设置规则，
     * 这样可以支持自定义的代理mock数据等场景
     *
     * @param getRulesCall
     * @param opts
     * @return {PageDriver}
     * @author helinjiang
     */
    useWhistle(getRulesCall, opts = {}) {
        // .useWhistle((data) => {
        //     return {
        //         name: `[auto]matman_demo_03_${data.port}`,
        //         rules: [
        //             `www.baidu.com ${path.join(__dirname, '../../../local-project')}/baidu.html`
        //         ]
        //     };
        // }, { autoStartWhistle: true })
        return this;
    }

    /**
     * 使用 mockstar 工具来做接口 mock 数据
     *
     * @param {MockStarQuery} mockstarQuery 详见 matman 组件的定义
     * @return {PageDriver}
     * @author helinjiang
     */
    useMockstar(mockstarQuery) {
        if (!mockstarQuery || (typeof mockstarQuery.getQueryString !== 'function')) {
            throw new Error('请传递正确的 MockStarQuery 对象，请参考： https://www.npmjs.com/package/mockstar');
        }

        this.mockstarQuery = mockstarQuery;

        return this;
    }

    /**
     * 为浏览器注入cookie
     * 参考 https://github.com/helinjiang/nightmare-handler/tree/master/demo/extend-exCookies
     *
     * @param {String | Object } cookies
     * @return {PageDriver}
     * @author helinjiang
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
     * @author helinjiang
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
     * @author helinjiang
     */
    setScreenshotConfig(screenshotConfig) {
        if (screenshotConfig) {
            this.screenshotConfig = new ScreenshotConfig(this.matmanConfig, screenshotConfig, this.caseModuleFilePath, this.tag);
        }
        return this;
    }

    /**
     * 设置覆盖率配置
     *
     * @param {Boolean | String | Object} coverageConfig
     * @return {PageDriver}
     * @author helinjiang
     */
    setCoverageConfig(coverageConfig) {
        if (coverageConfig) {
            this.coverageConfig = new CoverageConfig(this.matmanConfig, coverageConfig, this.caseModuleFilePath, this.tag);
        }

        return this;
    }

    /**
     * 设置执行结果配置
     *
     * @param {Boolean | String | Object} matmanResultConfig
     * @return {PageDriver}
     * @author helinjiang
     */
    setMatmanResultConfig(matmanResultConfig) {
        if (matmanResultConfig) {
            this.matmanResultConfig = new MatmanResultConfig(this.matmanConfig, matmanResultConfig, this.caseModuleFilePath, this.tag);
        }

        return this;
    }

    /**
     * 加载页面地址
     *
     * @param pageUrl
     * @return {PageDriver}
     * @author helinjiang
     */
    goto(pageUrl) {
        this.pageUrl = pageUrl;
        return this;
    }

    /**
     * 增加行为过程
     *
     * @param {String} actionName 行为名，可通过它来获得最后的数据
     * @param {Function} actionCall 执行函数，接受一个 nightmare 对象，可以直接操作
     * @return {PageDriver}
     * @author helinjiang
     */
    addAction(actionName, actionCall) {
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
     * @author helinjiang
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
     * @author helinjiang
     */
    evaluate(fn, ...args) {
        if (typeof fn === 'string') {
            // 获取 crawler script 的源文件目录
            // fn 有可能是绝对路径，也可能是相对路径，但都要转为绝对路径
            // 如果是相对路径，则是相对于 caseModuleFilePath 而言的
            const crawlerScriptSrcPath = path.resolve(path.dirname(this.caseModuleFilePath), fn);

            // 调用 crawlerParser 的方法获得该脚本构建之后的路径
            this.nightmareEvaluateFn = new CrawlerParser(this.matmanConfig).getCrawlerScriptPath(crawlerScriptSrcPath);

            // 有可能地址不存在脚本构建地址，此时给与提示
            if (!this.nightmareEvaluateFn) {
                throw new Error(`无法根据 ${fn} 获得构建之后的爬虫脚本文件，请检查文件路径是否正确，或者检查是否执行过构建！`);
            }
        } else {
            this.nightmareEvaluateFn = fn;
            this.nightmareEvaluateFnArgs = args;
        }

        return this;
    }

    /**
     * 结束，获取结果
     * @return {Promise<{}>}
     * @author helinjiang
     */
    end() {
        let nightmareMaster = new NightmareMaster(this);

        // 默认处理 coverage，根据 window.__coverage__
        if (!this.coverageConfig) {
            this.setCoverageConfig(true);
        }

        // 默认处理 matmanResult
        if (!this.matmanResultConfig) {
            this.setMatmanResultConfig(true);
        }

        // 兼容没有定义 run 方法的场景
        if (!this.actionList.length) {
            this._isDefaultScanMode = true;
            this.addAction('_scan_page_', function (nightmareRun) {
                return nightmareRun.wait(500);
            });
        }

        return nightmareMaster.getResult()
            .then((resultData) => {
                return new MatmanResult(resultData);
            })
            .then((matmanResult) => {
                // 由于此处返回的是一个元素的数组，不便于后续处理，因此需要转义为对象返回
                if (this._isDefaultScanMode) {
                    matmanResult.data = matmanResult.get(0);
                }

                return matmanResult;
            })
            .then((matmanResult) => {
                // 保存数据快照
                if (this.matmanResultConfig) {
                    fse.outputJsonSync(this.matmanResultConfig.path, matmanResult);
                }

                return matmanResult;
            });
    }

    /**
     * 执行自定义的方法，适用于 debug 和自定义扩展等场景
     *
     * @param customFn
     * @return {PageDriver}
     * @author helinjiang
     */
    executeCustomFn(customFn) {
        if (typeof customFn === 'function') {
            customFn(this);
        }
        return this;
    }
}
