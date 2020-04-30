import { getNightmarePlus, WebEventRecorder } from 'nightmare-handler';
import ScreenshotConfig from './ScreenshotConfig';
import CoverageConfig from './CoverageConfig';
import DeviceConfig from './DeviceConfig';

export default class NightmareMaster {
    /**
     * 构造函数
     *
     * @param {String} pageUrl 页面的 URL 地址
     * @param {String} crawlerScriptPath 运行在浏览器中的前端爬虫脚本，需要是绝对路径
     * @param {Object} [opts] 额外参数
     * @param {Boolean} [opts.show] 是否需要展示浏览器，默认为 false
     * @param {String} [opts.proxyServer] 代理服务器，例如 127.0.0.1:8899，或者 `my_proxy_server.example.com:8080`，详见 https://github.com/segmentio/nightmare#switches
     * @param {String | Number} [opts.wait] wait配置，会直接透传给 nightmare 的 wait 配置项，详细请查看 https://github.com/segmentio/nightmare#waitms
     * @param {Boolean} [opts.doNotEnd] 是否在执行完成之后不要关闭浏览器，默认为 false
     * @param {String} [opts.cookie] 为浏览器注入cookie，格式与 document.cookie 一致
     * @param {Object} [opts.mockstarQuery] 指定 mockstar 的query参数，用于数据打桩
     * @param {Boolean} [opts.useRecorder] 是否使用记录器记录所有浏览器行为，包括请求等
     * @param {String} [opts.tag] 额外标记，用于区分不同的执行，在截图等场景做区分
     * @param {undefined | ScreenshotConfig} [opts.screenshotConfig] 截图设置
     * @param {undefined | DeviceConfig} [opts.deviceConfig] 设备设置
     * @param {undefined | CoverageConfig} [opts.coverageConfig] 测试覆盖率设置
     */
    constructor(pageDriver) {
        this.pageDriver = pageDriver;

        // 是否使用记录器记录整个请求队列
        // 如果为 true，则可以从 this.globalInfo.recorder 中获取，
        // 如果为 字符串，则可以从 this.globalInfo[xxx] 中获取，
        this.globalInfoRecorderKey = (function (useRecorder) {
            if (!useRecorder) {
                return '';
            }

            return (typeof useRecorder === 'boolean') ? 'recorder' : useRecorder + '';
        })(this.pageDriver.useRecorder);

        this.nightmare = null;

        // this.pageUrl = pageUrl;
        // this.crawlerScriptPath = crawlerScriptPath;
        //
        // // 校验 crawlerScriptPath 必须是存在的，否则后续的逻辑也执行不了
        // // 如果获取 client script 地址不存在，则抛出异常提示
        // if (!fs.existsSync(crawlerScriptPath)) {
        //     throw new Error('Unknown crawlerScriptPath=' + crawlerScriptPath);
        // }
        //
        // this.show = opts.show;
        // this.wait = opts.wait;
        // this.doNotEnd = opts.doNotEnd;
        // this.cookie = opts.cookie;
        //
        // /**
        //  * 设置代理服务器。
        //  * https://github.com/segmentio/nightmare#switches
        //  *
        //  * @type {String} 代理服务器，类似 my_proxy_server.example.com:8080
        //  */
        // this.proxyServer = opts.proxyServer;
        //
        // this.mockstarQuery = opts.mockstarQuery || null;
        //
        // // 截屏设置
        // this.screenshotConfig = opts.screenshotConfig;
        //
        // // 设备设置
        // this.deviceConfig = opts.deviceConfig;
        //
        // // 测试覆盖率
        // this.coverageConfig = opts.coverageConfig;

        this.globalInfo = {};

        this.onNightmareCreated = (self) => {

        };

        this.onBeforeGotoPage = (self) => {

        };

        this.onElectronClose = (self) => {

        };
    }

    async getResult() {
        // Nightmare constructor 的参数
        const nightmareConfig = this.pageDriver.nightmareConfig;

        // 如果设置了 show ，则同步打开开发者工具面板
        if (nightmareConfig.show) {
            // https://www.npmjs.com/package/nightmare#opendevtools
            nightmareConfig.openDevTools = {
                mode: 'detach'
            };
        }

        // 如果传入了代理服务，则设置代理服务器
        if (this.pageDriver.proxyServer) {
            nightmareConfig.switches = {
                'proxy-server': this.pageDriver.proxyServer,

                // 必须设置一下这个，否则在某些情况下 https 地址无法使用
                // https://github.com/matmanjs/matman/issues/159
                'ignore-certificate-errors': true
            };
        }

        // 如果传递给 evaluate 的是一个本地绝对路径文件，则需要设置 preload
        if (typeof this.pageDriver.nightmareEvaluateFn === 'string') {
            nightmareConfig.webPreferences = {
                // 用例过多且频繁启动测试时可能会存在失败的场景 #154
                partition: 'nopersist',
                preload: this.pageDriver.nightmareEvaluateFn
            };
        }

        // console.log('===nightmareConfig====', nightmareConfig);

        // 创建 nightmare 对象，注意使用扩展的 NightmarePlus ，而不是原生的 Nightmare
        const NightmarePlus = getNightmarePlus();
        this.nightmare = NightmarePlus(nightmareConfig);

        // 钩子事件：创建完成之后，可能会有一些自己的处理
        this.onNightmareCreated(this);

        // 使用记录器，记录网络请求和浏览器事件等
        if (this.globalInfoRecorderKey) {
            this.globalInfo[this.globalInfoRecorderKey] = new WebEventRecorder(this.nightmare);
        }

        // 初始化一些行为
        this.nightmareRun = this.nightmare
            .header('x-mat-from', 'nightmare')
            .header('x-mat-timestamp', Date.now());

        // 设置设备
        if (this.pageDriver.deviceConfig) {
            this.nightmareRun = this.nightmareRun.exDevice(this.pageDriver.deviceConfig.name, {
                UA: this.pageDriver.deviceConfig.UA,
                width: this.pageDriver.deviceConfig.width,
                height: this.pageDriver.deviceConfig.height
            });
        }

        // 设置 cookie
        // if (this.cookie) {
        //     this.nightmareRun = this.nightmareRun.exCookies(this.cookie, getMainUrl(this.pageUrl));
        // }

        //  钩子事件：加载页面之前要执行的方法
        this.onBeforeGotoPage(this);

        // 加载页面
        this.nightmareRun = this.nightmareRun.goto(this.pageDriver.pageUrl);

        // 如果指定了 wait，则会传递给 nightmare 处理，具体使用方法可以参考：
        // https://github.com/segmentio/nightmare#waitms
        // https://github.com/segmentio/nightmare#waitselector
        // https://github.com/segmentio/nightmare#waitfn-arg1-arg2
        if (typeof this.pageDriver.nightmareWaitFn !== 'undefined') {
            this.nightmareRun = this.nightmareRun.wait(this.pageDriver.nightmareWaitFn, ...this.pageDriver.nightmareWaitFnArgs);
        }

        // 循环处理多个 action
        let result = [];

        for (let i = 0, length = this.pageDriver.actionList.length; i < length; i++) {
            let curRun = this.pageDriver.actionList[i](this.nightmareRun);

            if (this.pageDriver.screenshotConfig) {
                curRun.screenshot(this.pageDriver.screenshotConfig.getPathWithId(i + 1), this.pageDriver.screenshotConfig.clip);
            }

            let t;
            if (typeof this.pageDriver.nightmareEvaluateFn === 'function') {
                t = await curRun.evaluate(this.pageDriver.nightmareEvaluateFn, ...this.pageDriver.nightmareEvaluateFnArgs);
            } else {
                t = await curRun.evaluate(evaluate);
            }

            // 覆盖率数据
            // if (t.__coverage__ && this.coverageConfig) {
            //     const coverageFilePath = this.coverageConfig.getPathWithId(i + 1);
            //     try {
            //         await fse.outputJson(coverageFilePath, t.__coverage__);
            //
            //         // 记录之后就删除之
            //         delete t.__coverage__;
            //     } catch (e) {
            //         console.log('save coverage file fail', coverageFilePath, e);
            //     }
            // }

            result.push(t);
        }

        // 暴露 electron 关闭时间，注意它在 nightmareRun.end() 之后才会触发
        if ((typeof this.onElectronClose === 'function') && this.nightmareRun.proc && this.nightmareRun.proc.on) {
            this.nightmareRun.proc.on('close', code => {
                // var code = {
                //     127: 'command not found - you may not have electron installed correctly',
                //     126: 'permission problem or command is not an executable - you may not have all the necessary dependencies for electron',
                //     1: 'general error - you may need xvfb',
                //     0: 'success!'
                // }
                this.onElectronClose(code);
            });
        }

        // 不关闭界面
        if (this.pageDriver.doNotCloseBrowser) {
            await this.nightmareRun;
        } else {
            await this.nightmareRun.end();
        }

        return {
            data: result,
            _dataIndexMap: this.pageDriver._dataIndexMap,
            globalInfo: this.globalInfo
        };
    }

    // addAction(actionName, actionCall) {
    //     if (typeof actionCall === 'function') {
    //         this.actionList.push(actionCall);
    //         this._dataIndexMap[actionName + ''] = this.actionList.length - 1;
    //     } else if (typeof actionName === 'function') {
    //         this.actionList.push(actionName);
    //     } else {
    //         throw new Error('addAction should assign function!');
    //     }
    // }

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

    const pageInfo = window.getPageInfo();

    if (window.__coverage__ && pageInfo) {
        pageInfo.__coverage__ = window.__coverage__;
    }

    return pageInfo;
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

