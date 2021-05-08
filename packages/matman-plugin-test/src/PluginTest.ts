// import path from 'path';
import { PluginBase } from 'matman-plugin-core';

import { ITestDefinedInstance } from './types';

interface IPluginTestOpts {
  definedInstanceDir: string
}

export default class PluginTest extends PluginBase {
  /**
   * 配置文件的目录
   */
  public definedInstanceDir: string;

  public constructor(opts: IPluginTestOpts) {
    super('test');

    this.definedInstanceDir = opts.definedInstanceDir;
  }

  public async setup() {
    console.log('==test== setup');
  }

  public async runTest() {
    console.log('==test== runTest');
    const instance = this.getActiveInstance();

    await instance.run();
  }

  public async teardown() {
    console.log('==test== teardown');
  }


  public getActiveInstance(): ITestDefinedInstance {
    // TODO 从 instance 里面读取 setup 方法并执行
    const activeInstance = '/Users/helinjiang/gitprojects/matman/debug-v7-demo/matman-app/src/plugins/test/mocha.js';

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const instance = require(activeInstance) as ITestDefinedInstance;

    console.log('--PluginTest instance--', instance);

    return instance;
  }
}
