'use strict';

var RESULT = {
    // 成功
    SUCCESS: 'SUCCESS',

    // asyncClient 未初始化
    NO_ASYNC_CLIENT: 'NO_ASYNC_CLIENT',

    // 桩数据服务启动失败
    NOT_CONNECTED: 'NOT_CONNECTED',

    // 桩数据服务被设置了禁用
    DISABLED: 'DISABLED'
};

/**
 *
 * @param {StubAsyncClient} asyncClient StubAsyncClient对象
 * @param {String} route 路由
 * @param {Object} [params] 参数
 * @return {Promise<any>}
 */
function asyncClientEmit(asyncClient, route, params) {
    return new Promise(function (resolve, reject) {
        // 有问题时直接执行真实的fetch方法
        if (!asyncClient) {
            return reject(RESULT.NO_ASYNC_CLIENT);
        }

        // 如果远程服务未启动也需要放弃stub
        if (!asyncClient.isConnected()) {
            alert('matman stub \u670D\u52A1\u672A\u542F\u52A8\uFF01\u8BF7\u68C0\u67E5 ' + asyncClient.getURI() + ' \u662F\u5426\u5DF2\u542F\u52A8');
            return reject(RESULT.NOT_CONNECTED);
        }

        // 发送信息到远程，然后接收其回调
        asyncClient.emit(route, params, function () {
            var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            // 如果stub服务端设置了禁用stub，则执行真实的fetch方法
            if (data._disable) {
                return reject(RESULT.DISABLED);
            }

            resolve(data);
        });
    });
}

module.exports = {
    asyncClientEmit: asyncClientEmit
};