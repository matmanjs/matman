'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * 通用的流程
 */
var _require = require('nightmare-handler'),
    NightmarePlus = _require.NightmarePlus;

var E2eTestAction = function () {
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
     */
    function E2eTestAction(pageUrl, preloadClientScriptPath) {
        var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        _classCallCheck(this, E2eTestAction);

        this.pageUrl = pageUrl;
        this.preloadClientScriptPath = preloadClientScriptPath;

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

        this.globalInfo = {};

        this.onNightmareCreated = function (self) {};

        this.onBeforeGotoPage = function (self) {};

        this.actionList = [];
    }

    _createClass(E2eTestAction, [{
        key: 'getResult',
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                var nightmareConfig, result, i, length, t;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                // nightmare 初始化参数
                                nightmareConfig = {
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
                                if (this.matmanQuery && typeof this.matmanQuery.getQueryString === 'function') {
                                    this.pageUrl = this.pageUrl + (this.pageUrl.indexOf('?') > -1 ? '&' : '?') + this.matmanQuery.getQueryString();
                                }

                                // console.log('===nightmareConfig====', nightmareConfig);

                                // 创建 nightmare 对象
                                this.nightmare = NightmarePlus(nightmareConfig);

                                // 创建完成之后，可能会有一些自己的处理
                                this.onNightmareCreated(this);

                                // 初始化一些行为
                                this.nightmareRun = this.nightmare.exDevice('mobile').exCookies(this.cookie, getMainUrl(this.pageUrl)).header('mat-from', 'nightmare').header('mat-timestamp', Date.now());

                                // 设置 cookie
                                if (this.cookie) {
                                    this.nightmareRun.exCookies(this.cookie, this.pageUrl);
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
                                result = [];
                                i = 0, length = this.actionList.length;

                            case 12:
                                if (!(i < length)) {
                                    _context.next = 20;
                                    break;
                                }

                                _context.next = 15;
                                return this.actionList[i](this.nightmareRun).evaluate(evaluate);

                            case 15:
                                t = _context.sent;


                                result.push(t);

                            case 17:
                                i++;
                                _context.next = 12;
                                break;

                            case 20:
                                if (!this.doNotEnd) {
                                    _context.next = 25;
                                    break;
                                }

                                _context.next = 23;
                                return this.nightmareRun;

                            case 23:
                                _context.next = 27;
                                break;

                            case 25:
                                _context.next = 27;
                                return this.nightmareRun.end();

                            case 27:
                                return _context.abrupt('return', {
                                    data: result,
                                    globalInfo: this.globalInfo
                                });

                            case 28:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function getResult() {
                return _ref.apply(this, arguments);
            }

            return getResult;
        }()
    }, {
        key: 'addAction',
        value: function addAction(actionCall) {
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

    }]);

    return E2eTestAction;
}();

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
        window.evalList.forEach(function (item) {
            eval(window[item]);
        });
    }

    return window.getPageInfo();
}

function getMainUrl(url) {
    var arr1 = url.split('//');

    if (arr1.length > 1) {
        var arr2 = arr1[1].split('/');
        return arr1[0] + '//' + arr2[0];
    } else {
        var _arr = arr1[0].split('/');
        return _arr[0];
    }
}

module.exports = E2eTestAction;