// import path from 'path';
import { PluginBase } from 'matman-plugin-core';
import { WhistleRule } from 'whistle-sdk';

import MockstarSDK from './MockstarSDK';
import DefinedInstance from './DefinedInstance';

interface IPluginMockstarOpts {
  port?: number
}

export default class PluginMockstar extends PluginBase {
  private readonly mockstarSDK: MockstarSDK;

  public constructor(opts?: IPluginMockstarOpts) {
    super('mockstar');

    this.mockstarSDK = new MockstarSDK({
      port: parseInt(`${process.env.MATMAN_PLUGIN_MOCKSTAR_PORT || opts?.port || 0}`, 10),
    });
  }


  public async setup() {
    console.log('==mockstar== setup');

    await this.mockstarSDK.start();

    this.cacheData.setCacheItem('port', this.mockstarSDK.port);
  }

  public async teardown() {
    console.log('==mockstar== teardown');
    await this.mockstarSDK.stop();
  }


  public getActiveInstance(): DefinedInstance {
    // TODO 从 instance 里面读取 setup 方法并执行
    const activeInstance = '/Users/helinjiang/gitprojects/matman/debug-v7-demo/matman-app/src/plugins/mockstar/page-index-basic.js';

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const instance = require(activeInstance) as DefinedInstance;

    console.log('--PluginMockstar instance--', instance);

    return instance;
  }


  public getWhistleRule(): WhistleRule | null {
    const instance = this.getActiveInstance();

    const rules = instance.getWhistleRules(this.cacheData);
    if (!rules) {
      return null;
    }

    // TODO 这里的 name 需要自动生成，例如按照当前 case module 的名字来生成
    return new WhistleRule('prod', rules);
  }
}
