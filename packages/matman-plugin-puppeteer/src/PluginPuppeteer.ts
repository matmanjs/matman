// import path from 'path';
import { PluginBase } from 'matman-plugin-core';

interface IPluginPuppeteerOpts {
  deviceDefinedInstanceDir?: string;
  networkConditionDefinedInstanceDir?: string;
  screenshotConfig?: boolean;
}

export default class PluginPuppeteer extends PluginBase {
  public deviceDefinedInstanceDir?: string;
  public networkConditionDefinedInstanceDir?: string;
  public screenshotConfig?: boolean;

  public constructor(opts: IPluginPuppeteerOpts) {
    super('puppeteer', __filename);

    this.deviceDefinedInstanceDir = opts.deviceDefinedInstanceDir;
    this.networkConditionDefinedInstanceDir = opts.networkConditionDefinedInstanceDir;
    this.screenshotConfig = opts.screenshotConfig;
  }
}
