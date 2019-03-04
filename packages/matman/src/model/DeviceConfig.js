export default class DeviceConfig {
    /**
     * 构造函数
     * @param {String || Object} opts 参数
     * @param {String} [opts.name] 设备名字
     * @param {String} [opts.UA] userAgent
     * @param {String} [opts.width] 视窗宽度
     * @param {String} [opts.height] 视窗高度
     */
    constructor(opts) {
        if (opts && (typeof opts === 'object')) {
            this.name = opts.name;
            this.UA = opts.UA;
            this.width = opts.width;
            this.height = opts.height;
        } else {
            this.name = opts;
        }
    }
}
