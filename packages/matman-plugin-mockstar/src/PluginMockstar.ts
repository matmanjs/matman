// import path from 'path';
import { PluginBase } from 'matman-plugin-core';

import MockstarSDK from './MockstarSDK';

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
  }

  public async teardown() {
    console.log('==mockstar== teardown');
    await this.mockstarSDK.stop();
  }
}
