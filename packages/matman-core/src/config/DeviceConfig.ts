/**
 * Device 配置选项
 *
 * @member name 设备名称
 * @member UA userAgent
 * @member width 视窗宽度
 * @member opts.height 视窗高度, 注意这里不是指页面的高度, 页面高度要小于这个值
 *
 * @author wangjq4214
 */
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
   * @param opts 设备名或者设备配置对象
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
