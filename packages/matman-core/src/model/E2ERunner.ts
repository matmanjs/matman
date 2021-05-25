

import MatmanConfig from '../config/MatmanConfig';
import { getFormattedMatmanConfig } from '../util';

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

    this.initPlugin();
  }


  public async setup() {
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let index = 0; index < this.matmanConfig.plugins.length; index++) {
      const plugin = this.matmanConfig.plugins[index];

      await plugin.setup.call(plugin, this);
    }
  }

  public async runTest() {
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let index = 0; index < this.matmanConfig.plugins.length; index++) {
      const plugin = this.matmanConfig.plugins[index];

      await plugin.runTest.call(plugin, this);
    }
  }

  public async teardown() {
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let index = 0; index < this.matmanConfig.plugins.length; index++) {
      const plugin = this.matmanConfig.plugins[index];

      await plugin.teardown.call(plugin, this);
    }
  }

  private async initPlugin() {
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let index = 0; index < this.matmanConfig.plugins.length; index++) {
      const plugin = this.matmanConfig.plugins[index];

      await plugin.initPlugin.call(plugin, this);
    }
  }
}


/**
 * 通过字符串获得一个 base64 值
 *
 * @param {String} data 字符串
 * @param {Number} length 保留多少位
 * @return {String}
 * @author linjianghe
 */
export function getBase64(data: string, length?: number): string {
  const buff = Buffer.from(`${data}`);
  const base64data = buff.toString('base64');
  return length ? base64data.slice(-1 * length) : base64data;
}

/**
 * 获得 seqId，每次启动自动化测试，就会自动生成的唯一ID，用于区别不同批次的流程
 *
 * @param {String} dwtPath dwt目录
 * @param {Boolean} isDev 是否为 dev 模式
 * @return {String} 保留两位有效数字，例如 99.19
 * @author linjianghe
 */
export function getSeqId(dwtPath: string, isDev: boolean): string {
  // 自动生成的唯一ID，用于区别不同批次的流程，
  // 尤其是有多个流程在同一个测试机中运行的时候，如果不做区分，则可能会有相互影响
  // 注意不要出现等号，否则whistle里面会有问题
  return isDev ? 'dev' : getBase64(dwtPath, 6).replace(/=/gi, 'd') + Date.now();
}
