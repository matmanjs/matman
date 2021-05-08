// import path from 'path';
import { PluginBase } from 'matman-plugin-core';

import WhistleSDK from 'whistle-sdk';


interface IPluginWhistleOpts {
  port?: number
}

export default class PluginWhistle extends PluginBase {
  /**
   * 序列号
   */
  public seqId: string;

  private readonly whistleSDK: WhistleSDK;

  public constructor(opts?: IPluginWhistleOpts) {
    super('whistle');

    this.seqId = `${this.name}-${Math.random()}`;

    this.whistleSDK = new WhistleSDK({
      seqId: this.seqId,
      port: parseInt(`${process.env.MATMAN_PLUGIN_WHISTLE_PORT || opts?.port || 0}`, 10),
      forceOverride: true,
      useCurrentStartedWhistle: false,
    });
  }

  public setSeqId(seqId: string) {
    this.seqId = seqId;
  }

  public async setup() {
    console.log('==whistle== setup');

    await this.whistleSDK.start();
  }

  public async teardown() {
    console.log('==whistle== teardown');
    await this.whistleSDK.stop();
  }
}
