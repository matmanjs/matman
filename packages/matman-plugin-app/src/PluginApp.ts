import { PluginBase } from 'matman-plugin-core';

interface IPluginAppOpts {
  source: string
}

export default class PluginApp extends PluginBase {
  /**
   * 配置文件的目录
   */
  public source: string;

  /**
   * @param opts {IPluginAppOpts}
   */
  public constructor(opts: IPluginAppOpts) {
    super('app');

    this.source = opts.source;
  }
}
