import io from 'socket.io-client';

export default class StubAsyncClient {
    constructor(url) {
        this.url = url;

        this.socket = io(url);

        this.init();
    }

    init() {
        let self = this;

        this.socket.on('connect', () => {
            console.log('connect ' + self.socket.id);
        });

        this.socket.on('disconnect', function () {
            console.log('disconnect');
        });
    }

    isConnected() {
        return this.socket.connected;
    }

    getURI() {
        return this.socket.io && this.socket.io.uri || '';
    }

    /**
     * 增加打桩点
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
     * 增加打桩点
     * @param {String} route 路由
     * @param {Object} params 额外的参数
     * @param {Function} callback 回调，接受一个参数：data（结果）
     */
    emit(route, params = {}, callback) {
        let eventName = route + Date.now();

        if (typeof callback === 'function') {
            this.socket.emit(route, params, {
                eventName: eventName
            });

            this.socket.on(eventName, (data) => {
                console.log('[stub-async-client on data after emit]', eventName, route, data);
                callback(data);
            });
        } else {
            this.socket.emit(route, params);
        }
    }
}
