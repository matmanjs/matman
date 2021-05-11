// import path from 'path';
import { PluginBase } from 'matman-plugin-core';
import { E2ERunner } from 'matman-core';

import MockstarSDK from './MockstarSDK';

interface IPluginMockstarOpts {
  port?: number;
}

export default class PluginMockstar extends PluginBase {
  private readonly mockstarSDK: MockstarSDK;

  public constructor(opts?: IPluginMockstarOpts) {
    super('mockstar');

    this.mockstarSDK = new MockstarSDK({
      port: parseInt(`${process.env.MATMAN_PLUGIN_MOCKSTAR_PORT || opts?.port || 0}`, 10),
    });
  }

  public async setup(e2eRunner: E2ERunner) {
    await super.setup(e2eRunner);

    await this.mockstarSDK.start();

    this.cacheData.setCacheItem('port', this.mockstarSDK.port);
  }

  public async teardown(e2eRunner: E2ERunner) {
    await super.teardown(e2eRunner);

    await this.mockstarSDK.stop();
  }
}
