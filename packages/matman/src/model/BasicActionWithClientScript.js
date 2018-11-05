/**
 * 通用的流程
 */
const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');
const { NightmarePlus, WebEventRecorder } = require('nightmare-handler');

class BasicActionWithClientScript {
    /**
     * 构造函数
     *
     * @param {String} pageUrl 页面的 URL 地址
     * @param {String} preloadClientScriptPath 运行在浏览器中的脚本文件本地地址，需要是绝对路径
     * @param {Object} [opts] 额外参数
     * @param {Boolean} [opts.show] 是否需要展示调试的webview窗口
     * @param {String} [opts.proxyServer] 代理服务器
     * @param {String | Number} [opts.wait] wait配置，会直接透传给 nightmare 的 wait 配置项，详细请查看 https://github.com/segmentio/nightmare#waitms
     * @param {Boolean} [opts.doNotEnd] 是否在执行完成之后关闭界面
     * @param {String} [opts.cookie] document.cookie的内容
     * @param {String} [opts.matmanQuery] 指定matman的query参数
     * @param {String | Boolean} [opts.useRecorder] 是否使用记录器记录整个请求队列
     * @param {String | Object} [opts.screenshot] 截图设置，如果为字符串则传递 cases 文件路径
     */
    constructor(pageUrl, preloadClientScriptPath, opts = {}) {
        this.pageUrl = pageUrl;
        this.preloadClientScriptPath = preloadClientScriptPath;

        // 校验 preloadClientScriptPath 必须是存在的，否则后续的逻辑也执行不了
        // 如果获取 client script 地址不存在，则抛出异常提示 #107
        if (!fs.existsSync(preloadClientScriptPath)) {
            throw new Error('Unknown preloadClientScriptPath=' + preloadClientScriptPath);
        }

        this.show = opts.show;
        this.wait = opts.wait;
        this.doNotEnd = opts.doNotEnd;
        this.cookie = opts.cookie;

        /**
         * 设置代理服务器。
         * https://github.com/segmentio/nightmare#switches
         *
         * @type {String} 代理服务器，类似 my_proxy_server.example.com:8080
         */
        this.proxyServer = opts.proxyServer;

        this.matmanQuery = opts.matmanQuery || null;

        // 是否使用记录器记录整个请求队列
        // 如果为 true，则可以从 this.globalInfo.recorder 中获取，
        // 如果为 字符串，则可以从 this.globalInfo[xxx] 中获取，
        this.useRecorder = (function (useRecorder) {
            if (!useRecorder) {
                return false;
            }

            return (typeof useRecorder === 'boolean') ? 'recorder' : useRecorder;
        })(opts.useRecorder);

        // https://github.com/segmentio/nightmare#screenshotpath-clip
        // this.screenshotConfig = (function (screenshot) {
        //     if (!screenshot) {
        //         return;
        //     }
        //
        //     let result = screenshot;
        //
        //     // 为字符串时则认为是 cases 的文件名，例如 /path/to/xx.js
        //     if (typeof screenshot === 'string') {
        //         const buildPath = getBuildPath(screenshot);
        //
        //         // ../e2e_test/page_withdraw/cases/select-check.js
        //
        //         // select-check
        //         let fileName = path.basename(screenshot, '.js');
        //
        //         // e2e_test/page_withdraw/cases/select-check.js
        //         let relativePath = path.relative(buildPath, screenshot).replace(/^\.([^[\\||\/])*[\\||\/]/gi, '');
        //
        //         // e2e_test_page_withdraw_cases
        //         let folderName = path.dirname(relativePath).replace(new RegExp(path.sep.replace(/\\/gi, '\\\\'), 'gi'), '_');
        //
        //         // 需要保存的文件夹路径
        //         const saveDir = path.join(buildPath, 'screenshot', folderName);
        //
        //         // 要保证这个目录存在，否则保存时会报错
        //         fse.ensureDirSync(saveDir);
        //
        //         result = {
        //             saveDir: saveDir,
        //             fileName: fileName
        //         };
        //     }
        //
        //     return result;
        // })(opts.screenshot);

        this.globalInfo = {};

        this.onNightmareCreated = (self) => {

        };

        this.onBeforeGotoPage = (self) => {

        };

        this.actionList = [];
    }

    async getResult() {
        // nightmare 初始化参数
        let nightmareConfig = {
            show: this.show,
            webPreferences: {
                preload: this.preloadClientScriptPath
            }
        };

        // 设置代理服务器
        if (this.proxyServer) {
            nightmareConfig.switches = {
                'proxy-server': this.proxyServer
            };
        }

        // 如果有设置符合要求的 matman 服务设置，则还需要额外处理一下
        if (this.matmanQuery && (typeof this.matmanQuery.getQueryString === 'function')) {
            this.pageUrl = this.pageUrl + ((this.pageUrl.indexOf('?') > -1) ? '&' : '?') + this.matmanQuery.getQueryString();
        }

        // console.log('===nightmareConfig====', nightmareConfig);

        // 创建 nightmare 对象
        this.nightmare = NightmarePlus(nightmareConfig);

        // 创建完成之后，可能会有一些自己的处理
        this.onNightmareCreated(this);

        // 使用记录器
        if (this.useRecorder) {
            this.globalInfo[this.useRecorder] = new WebEventRecorder(this.nightmare);
        }

        // 初始化一些行为
        this.nightmareRun = this.nightmare
            .exDevice('mobile')
            .header('x-mat-from', 'nightmare')
            .header('x-mat-timestamp', Date.now());

        // 设置 cookie
        if (this.cookie) {
            this.nightmareRun.exCookies(this.cookie, getMainUrl(this.pageUrl));
        }

        // 加载页面之前要执行的方法
        this.onBeforeGotoPage(this);

        // 加载页面
        this.nightmareRun = this.nightmareRun.goto(this.pageUrl);

        // 如果指定了 opts.wait，则会传递给 nightmare 处理，具体使用方法可以参考：
        // https://github.com/segmentio/nightmare#waitms
        if (typeof this.wait !== 'undefined') {
            this.nightmareRun = this.nightmareRun.wait(this.wait);
        }

        // 循环处理多个 action
        let result = [];

        for (let i = 0, length = this.actionList.length; i < length; i++) {
            let curRun = this.actionList[i](this.nightmareRun);

            if (this.screenshotConfig) {
                curRun.screenshot(this.screenshotConfig.path || path.join(this.screenshotConfig.saveDir, [this.screenshotConfig.fileName, i + 1].join('_') + '.png'), this.screenshotConfig.clip);
            }

            let t = await curRun.evaluate(evaluate);

            result.push(t);
        }

        // 不关闭界面
        if (this.doNotEnd) {
            await this.nightmareRun;
        } else {
            await this.nightmareRun.end();
        }

        return {
            data: result,
            globalInfo: this.globalInfo
        };
    }

    addAction(actionCall) {
        this.actionList.push(actionCall);
    }

    //
    // onNightmareCreated(callback) {
    //     if (typeof callback === 'function') {
    //         return callback(this.nightmare);
    //     }
    //
    //     return this.nightmare;
    // }

}

function evaluate() {
    // 如果没有这个变量，说明注入代码失败
    if (!window.matman_ver) {
        return {
            error: 'preload failed!'
        };
    }

    // window.getPageInfo 必须是个函数
    // window.getPageInfo 方法和其他变量均由 preload 配置中的 js 文件引入
    if (typeof window.getPageInfo !== 'function') {
        return {
            error: 'window.getPageInfo is not function!'
        };
    }

    // 如果存在需要前端执行的代码，则在所有逻辑开始之前执行
    if (window.evalList && window.evalList.length) {
        window.evalList.forEach((item) => {
            eval(window[item]);
        });
    }

    return window.getPageInfo();
}

function getMainUrl(url) {
    let arr1 = url.split('//');

    if (arr1.length > 1) {
        let arr2 = arr1[1].split('/');
        return arr1[0] + '//' + arr2[0];
    } else {
        let arr2 = arr1[0].split('/');
        return arr2[0];
    }
}

module.exports = BasicActionWithClientScript;