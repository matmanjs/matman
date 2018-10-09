import io from 'socket.io-client';

export default class StubAsyncCient {
    constructor(url) {
        this.url = url;

        this.socket = io(url);

        // 序列号，用于识别不同的事件
        this._seq = 0;

        this.init();
    }

    init() {
        let self = this;

        this.socket.on('connect', () => {
            console.log('connect ' + self.socket.id);
        });

        this.socket.on('disconnect', function () {
            console.log('disconnect ' + self.socket.id);
        });
    }

    isConnected() {
        return this.socket.connected;
    }

    getURI() {
        return this.socket.io && this.socket.io.uri || '';
    }

    /**
     * 监听某个桩数据回调
     * @param {String} route 路由
     * @param {Function} callback 回调，接受一个参数：data（结果）
     */
    on(route, callback) {
        this.socket.on(route, (data) => {
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
    emit(route, params = {}, callback) {
        if (typeof callback === 'function') {
            // 生成一个唯一的事件名，以便能够监听桩数据的返回
            let eventName = `[${Date.now()}][${this._seq}]${route}`;

            this._seq++;

            // 触发请求
            this.socket.emit(route, params, {
                eventName: eventName
            });

            // 接受回调
            this.socket.on(eventName, (data) => {
                console.log('[stub-async-client on data after emit]', eventName, route, data);
                callback(data);
            });
        } else {
            // 触发请求
            this.socket.emit(route, params);
        }
    }
}
