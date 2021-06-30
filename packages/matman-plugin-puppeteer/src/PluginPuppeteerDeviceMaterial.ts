import { MaterialBase } from 'matman-plugin-core';
import _ from 'lodash';
import { getPuppeteerDefinedDevice, puppeteer } from 'matman-runner-puppeteer';

type PluginPuppeteerDeviceMaterialOpts = PluginPuppeteerDeviceMaterial | {
  userAgent: string;
  viewport?: {
    width?: number;
    height?: number;
    deviceScaleFactor?: number;
    isMobile?: boolean;
    hasTouch?: boolean;
    isLandscape?: boolean;
  };
};

type ICloneCallFn = (deviceName: string) => puppeteer.devices.Device;
type IGetDeviceInstanceCallFn = (clone: ICloneCallFn) => PluginPuppeteerDeviceMaterial;
type IRequiredModule = PluginPuppeteerDeviceMaterial | IGetDeviceInstanceCallFn;

// https://github.com/puppeteer/puppeteer/blob/v9.1.1/docs/api.md#puppeteerlaunchoptions
const defaultViewport = {
  width: 800,
  height: 600,
  deviceScaleFactor: 1,
  isMobile: false,
  hasTouch: false,
  isLandscape: false,
};

export default class PluginPuppeteerDeviceMaterial extends MaterialBase {
  public userAgent: string;
  public viewport: {
    width: number;
    height: number;
    deviceScaleFactor: number;
    isMobile: boolean;
    hasTouch: boolean;
    isLandscape: boolean;
  };

  public constructor(filename: string, opts: PluginPuppeteerDeviceMaterialOpts, name?: string) {
    super('PluginPuppeteerDeviceMaterial', filename, name);

    this.userAgent = opts.userAgent;

    this.viewport = _.merge({}, defaultViewport, opts.viewport);
  }
}

export function getPluginPuppeteerDeviceMaterial(requiredModule?: IRequiredModule):
PluginPuppeteerDeviceMaterial | null {
  if (!requiredModule) {
    return null;
  }

  // 如果模块已经是 DeviceInstance，则直接返回
  if (requiredModule instanceof PluginPuppeteerDeviceMaterial) {
    return requiredModule;
  }

  // 如果模块是函数，则传入 clone 函数
  if (typeof requiredModule === 'function') {
    return requiredModule((deviceName: string) => {
      const definedDevice = getPuppeteerDefinedDevice(deviceName);

      if (!definedDevice) {
        throw new Error(`${deviceName} is not in puppeteer.devices! Please check https://github.com/puppeteer/puppeteer/blob/main/src/common/DeviceDescriptors.ts`);
      }

      return definedDevice;
    });
  }

  return null;
}
