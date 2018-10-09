'use strict';

var RESULT = {
    // 成功
    SUCCESS: 'SUCCESS',

    // asyncClient 未初始化
    NO_ASYNC_CLIENT: 'NO_ASYNC_CLIENT',

    // 桩数据服务启动失败
    NOT_CONNECTED: 'NOT_CONNECTED',

    // 没有路由
    NO_ROUTE: 'NO_ROUTE',

    // 桩数据服务被设置了禁用
    DISABLED: 'DISABLED'
};

/**
 * 请求数据
 *
 * @param {StubAsyncClient} asyncClient StubAsyncClient对象
 * @param {String} route 路由
 * @param {Object} [params] 参数
 * @return {Promise<any>}
 */
function request(asyncClient, route, params) {
    return new Promise(function (resolve, reject) {
        _check(asyncClient, route).then(function () {
            // 发送信息到远程，然后接收其回调
            asyncClient.emit(route, params, function (data) {
                // 如果stub服务端设置了禁用stub，则执行真实的fetch方法
                if (data && data._disable) {
                    return reject(RESULT.DISABLED);
                }

                resolve(data);
            });
        }).catch(function (err) {
            reject(err);
        });
    });
}

/**
 * 请求数据
 *
 * @param {StubAsyncClient} asyncClient StubAsyncClient对象
 * @param {String} route 路由
 * @param {Object} [params] 参数
 * @return {Promise<any>}
 */
function recieve(asyncClient, route, params) {
    return new Promise(function (resolve, reject) {
        _check(asyncClient, route).then(function () {
            asyncClient.on(route, params, function (data) {
                // 如果stub服务端设置了禁用stub，则执行真实的fetch方法
                if (data && data._disable) {
                    return reject(RESULT.DISABLED);
                }

                resolve(data);
            });
        }).catch(function (err) {
            reject(err);
        });
    });
}

/**
 * 检查参数
 * @param {StubAsyncClient} asyncClient StubAsyncClient对象
 * @param {String} route 路由
 * @return {Promise<any>}
 */
function _check(asyncClient, route) {
    return new Promise(function (resolve, reject) {

        // 使之异步，避免 websocket 还未连接成功
        setTimeout(function () {
            // 有问题时直接执行真实的fetch方法
            if (!asyncClient) {
                return reject(RESULT.NO_ASYNC_CLIENT);
            }

            // 如果远程服务未启动也需要放弃stub
            if (!asyncClient.isConnected()) {
                alert('matman stub \u670D\u52A1\u672A\u542F\u52A8\uFF01\u8BF7\u68C0\u67E5 ' + asyncClient.getURI() + ' \u662F\u5426\u5DF2\u542F\u52A8');
                return reject(RESULT.NOT_CONNECTED);
            }

            // 如果远程服务未启动也需要放弃stub
            if (!route) {
                return reject(RESULT.NO_ROUTE);
            }

            resolve();
        }, 10);
    });
}

module.exports = {
    request: request,
    recieve: recieve
};