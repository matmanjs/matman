import { DefinedInstanceBase } from 'matman-plugin-core';
import _ from 'lodash';

type DeviceInstanceOpts = {
  userAgent: string;
  viewport?: {
    width?: number;
    height?: number;
    deviceScaleFactor?: number;
    isMobile?: boolean;
    hasTouch?: boolean;
    isLandscape?: boolean;
  }
} | DeviceInstance;

// https://github.com/puppeteer/puppeteer/blob/v9.1.1/docs/api.md#puppeteerlaunchoptions
const defaultViewport = {
  width: 800,
  height: 600,
  deviceScaleFactor: 1,
  isMobile: false,
  hasTouch: false,
  isLandscape: false,
};

export default class DeviceInstance extends DefinedInstanceBase  {
  public userAgent: string;
  public viewport: {
    width: number;
    height: number;
    deviceScaleFactor: number;
    isMobile: boolean;
    hasTouch: boolean;
    isLandscape: boolean;
  };

  public constructor(name: string, opts: DeviceInstanceOpts) {
    super(name);

    this.userAgent = opts.userAgent;

    this.viewport = _.merge({}, defaultViewport, opts.viewport);
  }
}
