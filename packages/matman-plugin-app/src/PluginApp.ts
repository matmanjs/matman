import { PluginBase } from 'matman-plugin-core';

interface IPluginAppOpts {
  definedInstanceDir: string
}

export default class PluginApp extends PluginBase {
  /**
   * 配置文件的目录
   */
  public definedInstanceDir: string;

  /**
   * 序列号
   */
  public seqId: string;


  public constructor(opts: IPluginAppOpts) {
    super('app');

    this.definedInstanceDir = opts.definedInstanceDir;
    this.seqId = `${this.name}-${Math.random()}`;
  }


  /**
   * 构建业务工程项目
   */
  public build() {

  }
}
