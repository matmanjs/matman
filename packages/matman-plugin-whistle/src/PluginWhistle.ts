// import path from 'path';
import _ from 'lodash';
import { PluginBase } from 'matman-plugin-core';

import WhistleSDK, { ISetRulesOpts } from 'whistle-sdk';

interface IPluginWhistleOpts {
  port?: number
}

export default class PluginWhistle extends PluginBase {
  private readonly whistleSDK: WhistleSDK;

  public constructor(opts?: IPluginWhistleOpts) {
    super('whistle');

    this.whistleSDK = new WhistleSDK({
      seqId: this.seqId,
      port: parseInt(`${process.env.MATMAN_PLUGIN_WHISTLE_PORT || opts?.port || 0}`, 10),
      forceOverride: true,
      useCurrentStartedWhistle: false,
    });
  }


  public async setup() {
    console.log('==whistle== setup');

    await this.whistleSDK.start();
  }

  public async teardown() {
    console.log('==whistle== teardown');
    await this.whistleSDK.stop();
  }

  public async setRules(opts: ISetRulesOpts) {
    console.log('==whistle== setRules');

    const params = _.merge({
      forceOverride: true,
      // saveDir: path.join(__dirname, 'tmp'),
      // fileName: 'test.whistle.js',
      handleRuleContent: (ruleContent: string, saveDir: string) => `${ruleContent}\n\n# ${saveDir}`,
    }, opts);

    await this.whistleSDK.setRules(params);
  }
}