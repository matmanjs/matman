// import path from 'path';
import { PluginBase } from 'matman-plugin-core';
import { WhistleRule } from 'whistle-sdk';

import { buildApp, IBuildAppCmd, IBuildAppOpts } from './utils';
import DefinedInstance from './DefinedInstance';

interface IPluginAppOpts {
  definedInstanceDir: string
}

export default class PluginApp extends PluginBase {
  /**
   * 配置文件的目录
   */
  public definedInstanceDir: string;

  /**
   * 业务工程项目的根目录
   */
  public cwd?: string;

  public constructor(opts: IPluginAppOpts) {
    super('app');

    this.definedInstanceDir = opts.definedInstanceDir;
  }

  /**
   * 构建业务工程项目
   */
  public async build(cmd: IBuildAppCmd, opts?: IBuildAppOpts) {
    console.log('--PluginApp build--', this);

    return buildApp(cmd, opts);
  }

  public async setup() {
    const instance = this.getActiveInstance();

    await instance.setup.call(instance, this);
  }

  public getActiveInstance(): DefinedInstance {
    // TODO 从 instance 里面读取 setup 方法并执行
    // const activeInstance = '/Users/helinjiang/gitprojects/matman/debug-v7-demo/matman-app/src/plugins/app/dev.js';
    const activeInstance = '/Users/helinjiang/gitprojects/matman/debug-v7-demo/matman-app/src/plugins/app/prod.js';

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const instance = require(activeInstance)() as DefinedInstance;

    console.log('--PluginApp instance--', instance);

    return instance;
  }

  public getWhistleRule(): WhistleRule | null {
    const instance = this.getActiveInstance();

    const rules = instance.getWhistleRules();
    if (!rules) {
      return null;
    }

    // TODO 这里的 name 需要自动生成，例如按照当前 case module 的名字来生成
    return new WhistleRule('prod', rules);
  }
}
