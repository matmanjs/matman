import _ from 'lodash';

// https://github.com/puppeteer/puppeteer/blob/main/src/common/DeviceDescriptors.ts
// https://github.com/puppeteer/puppeteer/blob/v4.0.0/docs/api.md#puppeteerconnectoptions
interface Viewport {
  // page width in pixels.
  width: number;

  // page height in pixels.
  height: number;

  // Specify device scale factor (can be thought of as dpr). Defaults to 1.
  deviceScaleFactor?: number;

  // Whether the meta viewport tag is taken into account. Defaults to false.
  isMobile?: boolean;

  // Specifies if viewport supports touch events. Defaults to false
  hasTouch?: boolean;

  // Specifies if viewport is in landscape mode. Defaults to false.
  isLandscape?: boolean;
}

// https://github.com/puppeteer/puppeteer/blob/main/src/common/DeviceDescriptors.ts
interface Device {
  name?: string;
  userAgent?: string;
  viewport?: Viewport;

  // 基于哪一个设备扩展
  extend?: string;
}

export type DeviceConfigOpts = string | Device;

const DEVICE_CHROME = {
  name: 'Chrome',
  userAgent:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Safari/537.36 matman/DEVICE_CHROME',
  viewport: {
    width: 800,
    height: 600,
    deviceScaleFactor: 1,
    isMobile: false,
    hasTouch: false,
    isLandscape: false,
  },
};

export default class DeviceConfig {
  name: string;
  userAgent: string;
  viewport: Viewport;
  extend?: string;

  /**
   * 构造函数
   * @param opts 设备名或者设备配置对象
   */
  constructor(opts: DeviceConfigOpts) {
    if (opts && typeof opts === 'object') {
      this.name = opts.name || 'unknown device';
      this.userAgent = opts.userAgent || DEVICE_CHROME.userAgent;
      this.viewport = _.merge({}, DEVICE_CHROME.viewport, opts.viewport);
      this.extend = opts.extend;
    } else {
      this.name = opts || 'unknown device';
      this.userAgent = DEVICE_CHROME.userAgent;
      this.viewport = DEVICE_CHROME.viewport;

      // 特殊处理
      if (this.name === 'mobile') {
        this.extend = 'iPhone 6';
      }
    }
  }

  updateExtend(extendDevice: Device) {
    this.userAgent = extendDevice.userAgent || this.userAgent;
    this.viewport = _.merge({}, this.viewport, extendDevice.viewport);
  }
}
