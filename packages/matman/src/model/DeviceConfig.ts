export interface DeviceConfigOpts {
  name: string;
  UA?: string;
  width?: number;
  height?: number;
}

export default class DeviceConfig {
  name: string;
  UA: string | undefined;
  width: number | undefined;
  height: number | undefined;

  /**
   * 构造函数
   * @param {String | Object} opts 设备名或者设备配置
   * @param {String} [opts.name] 设备名字
   * @param {String} [opts.UA] userAgent
   * @param {Number} [opts.width] 视窗宽度
   * @param {Number} [opts.height] 视窗高度，注意这里不是指页面的高度，页面高度要小于这个值
   * @author helinjiang
   */
  constructor(opts: string | DeviceConfigOpts) {
    if (opts && typeof opts === 'object') {
      this.name = opts.name;
      this.UA = opts.UA;
      this.width = opts.width;
      this.height = opts.height;
    } else {
      this.name = opts;
    }
  }
}
