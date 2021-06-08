// import path from 'path';
import _ from 'lodash';
import { PluginBase } from 'matman-plugin-core';
import { Pipeline } from 'matman-core';

import WhistleSDK, { ISetRulesOpts } from 'whistle-sdk';

interface IPluginWhistleOpts {
  port?: number;
  seqId?: string;
}

export default class PluginWhistle extends PluginBase {
  private readonly whistleSDK: WhistleSDK;

  public constructor(opts?: IPluginWhistleOpts) {
    super('whistle', __filename);

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

  public async setup(pipeline: Pipeline) {
    await super.setup(pipeline);

    // 启动 whistle
    await this.whistleSDK.start();

    // 缓存 whistle 的端口
    this.cacheData.setCacheItem('port', this.whistleSDK.port);
  }

  public async teardown(pipeline: Pipeline) {
    await super.teardown(pipeline);

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
