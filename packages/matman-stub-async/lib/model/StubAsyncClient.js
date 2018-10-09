'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var io = require('socket.io-client');

var StubAsyncClient = function () {
    function StubAsyncClient(url) {
        _classCallCheck(this, StubAsyncClient);

        this.url = url;

        this.socket = io(url);

        // 序列号，用于识别不同的事件
        this._seq = 0;

        this.init();
    }

    _createClass(StubAsyncClient, [{
        key: 'init',
        value: function init() {
            var self = this;

            this.socket.on('connect', function () {
                console.log('connect ' + self.socket.id);
            });

            this.socket.on('disconnect', function () {
                console.log('disconnect ' + self.socket.id);
            });
        }
    }, {
        key: 'isConnected',
        value: function isConnected() {
            return this.socket.connected;
        }
    }, {
        key: 'getURI',
        value: function getURI() {
            return this.socket.io && this.socket.io.uri || '';
        }

        /**
         * 监听某个桩数据回调
         * @param {String} route 路由
         * @param {Function} callback 回调，接受一个参数：data（结果）
         */

    }, {
        key: 'on',
        value: function on(route, callback) {
            this.socket.on(route, function (data) {
                console.log('[stub-async-client on data]', route, data);

                if (typeof callback === 'function') {
                    callback(data);
                }
            });
        }

        /**
         * 主动查询某个桩数据
         * @param {String} route 路由
         * @param {Object} params 额外的参数
         * @param {Function} callback 回调，接受一个参数：data（结果）
         */

    }, {
        key: 'emit',
        value: function emit(route) {
            var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            var callback = arguments[2];

            if (typeof callback === 'function') {
                // 生成一个唯一的事件名，以便能够监听桩数据的返回
                var eventName = '[' + Date.now() + '][' + this._seq + ']' + route;

                this._seq++;

                // 触发请求
                this.socket.emit(route, params, {
                    eventName: eventName
                });

                // 接受回调
                this.socket.on(eventName, function (data) {
                    console.log('[stub-async-client on data after emit]', eventName, route, data);
                    callback(data);
                });
            } else {
                // 触发请求
                this.socket.emit(route, params);
            }
        }
    }]);

    return StubAsyncClient;
}();

module.exports = StubAsyncClient;