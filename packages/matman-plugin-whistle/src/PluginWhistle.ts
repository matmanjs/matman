// import path from 'path';
import _ from 'lodash';
import { PluginBase } from 'matman-plugin-core';
import { E2ERunner } from 'matman-core';

import WhistleSDK, { ISetRulesOpts } from 'whistle-sdk';

interface IPluginWhistleOpts {
  port?: number;
  seqId?: string;
}

export default class PluginWhistle extends PluginBase {
  private readonly whistleSDK: WhistleSDK;

  public constructor(opts?: IPluginWhistleOpts) {
    super('whistle');

    if (opts?.seqId) {
      this.seqId = opts.seqId;
    }

    this.whistleSDK = new WhistleSDK({
      seqId: this.seqId,
      port: parseInt(`${process.env.MATMAN_PLUGIN_WHISTLE_PORT || opts?.port || 0}`, 10),
      forceOverride: true,
      useCurrentStartedWhistle: false,
    });
  }

  public async setup(e2eRunner: E2ERunner) {
    await super.setup(e2eRunner);

    // 启动 whistle
    await this.whistleSDK.start();

    // 缓存 whistle 的端口
    this.cacheData.setCacheItem('port', this.whistleSDK.port);
  }

  public async teardown(e2eRunner: E2ERunner) {
    await super.teardown(e2eRunner);

    // 停止 whistle
    await this.whistleSDK.stop();
  }

  public async setRules(opts: ISetRulesOpts) {
    console.log('==whistle== setRules');

    const params = _.merge({
      forceOverride: true,
      // saveDir: path.join(__dirname, 'tmp'),
      // fileName: 'test.whistle.js',
      handleRuleContent: (ruleContent: string, saveDir: string) => `${ruleContent}\n\n# ${saveDir}\n# ${new Date()}`,
    }, opts);

    await this.whistleSDK.setRules(params);
  }

  public getLocalWhistleServer() {
    return `127.0.0.1:${this.cacheData.getCacheItem('port') || 8899}`;
  }
}
