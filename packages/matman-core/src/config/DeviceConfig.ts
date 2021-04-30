import _ from 'lodash';

// https://github.com/puppeteer/puppeteer/blob/main/src/common/DeviceDescriptors.ts
// https://github.com/puppeteer/puppeteer/blob/v4.0.0/docs/api.md#puppeteerconnectoptions
interface IViewport {
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
interface IDevice {
  name?: string;
  userAgent?: string;
  viewport?: IViewport;

  // 基于哪一个设备扩展
  extend?: string;
}

export type IDeviceConfigOpts = string | IDevice;

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
  public name: string;
  public userAgent?: string;
  public viewport?: IViewport;
  public extend?: string;

  public constructor(opts?: IDeviceConfigOpts) {
    if (opts && typeof opts === 'object') {
      // 如果 opts 为对象
      this.name = opts.name || 'unknown device';
      this.userAgent = opts.userAgent;
      this.viewport = opts.viewport;
      this.extend = opts.extend;
    } else {
      // 如果 opts 字符串，则指代 name
      this.name = opts || 'unknown device';

      // 特殊处理，兼容历史
      if (this.name === 'mobile') {
        this.extend = 'iPhone 6';
      }
    }
  }

  public updateExtend(extendDevice: IDevice) {
    this.userAgent = extendDevice.userAgent || this.userAgent;
    this.viewport = _.merge({}, extendDevice.viewport, this.viewport);
  }

  public getConfig() {
    return _.merge({}, DEVICE_CHROME, {
      name: this.name,
      userAgent: this.userAgent,
      viewport: this.viewport,
    });
  }

  public getExtend() {
    return this.extend;
  }
}
