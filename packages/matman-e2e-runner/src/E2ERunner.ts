// import fse from 'fs-extra';
// import { PluginBase } from 'matman-plugin-core';
import { getFormattedMatmanConfig, MatmanConfig } from 'matman-core';

import { getSeqId } from './util';

export default class E2ERunner {
  public matmanConfig: MatmanConfig;
  public seqId: string;


  // private cacheData: StringObject<unknown>;
  // private readonly cacheProcessArr: ProcessCmd[];
  // private readonly startTime: number;

  public constructor(matmanConfigFilePath: string) {
    const matmanConfig = getFormattedMatmanConfig(matmanConfigFilePath);

    if (!matmanConfig) {
      throw new Error(`[E2ERunner] Could not get MatmanConfig from ${matmanConfigFilePath}`);
    }

    this.matmanConfig = matmanConfig;

    // 自动生成的唯一ID，用于区别不同批次的流程，
    // 尤其是有多个流程在同一个测试机中运行的时候，如果不做区分，则可能会有相互影响
    // 注意不要出现等号，否则whistle里面会有问题
    this.seqId = getSeqId(this.matmanConfig.outputPath, this.matmanConfig.isDevBuild);

    // TODO 有些默认的插件需要追加到 this.matmanConfig.plugins
  }

  public async setup() {
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let index = 0; index < this.matmanConfig.plugins.length; index++) {
      const plugin = this.matmanConfig.plugins[index];

      await plugin.setup.call(plugin);
    }
  }

  public async runTest() {
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let index = 0; index < this.matmanConfig.plugins.length; index++) {
      const plugin = this.matmanConfig.plugins[index];

      await plugin.runTest.call(plugin);
    }
  }

  public async teardown() {
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let index = 0; index < this.matmanConfig.plugins.length; index++) {
      const plugin = this.matmanConfig.plugins[index];

      await plugin.teardown.call(plugin);
    }
  }
}
