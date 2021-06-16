import fs from 'fs';
import path from 'path';
import MatmanConfig from '../config/MatmanConfig';
import { findMatmanConfig, requireModule } from '../util';
import { IMaterialBase } from '../typings/material';

const globalAny: any = global;
export interface IPipelineOpts {
  pluginAppCurMaterial?: IMaterialBase;
  pluginMochaMaterial?: IMaterialBase;
}
export default class Pipeline {
  public name: string;
  public filename: string;
  public matmanConfig: MatmanConfig;
  public seqId: string;

  public opts? : IPipelineOpts;

  // private cacheData: StringObject<unknown>;
  // private readonly cacheProcessArr: ProcessCmd[];
  // private readonly startTime: number;

  public constructor(filename: string, opts?: IPipelineOpts, name?: string) {
    this.filename = filename;

    // 必须保证 this.filename 为文件，否则后续逻辑可能会出错
    if (!fs.statSync(this.filename).isFile()) {
      throw new Error(`${this.filename} is not file!`);
    }

    this.opts = opts;
    this.name = name || path.basename(this.filename);

    // 查找并获取 matman.config.js 的内容
    const matmanConfig = findMatmanConfig(this.filename);

    if (!matmanConfig) {
      throw new Error(`[Pipeline] Could not get MatmanConfig from ${this.filename}`);
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

  public updatePlugin(pluginConfigArr: any[]) {
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let index = 0; index < this.matmanConfig.plugins.length; index++) {
      const plugin = this.matmanConfig.plugins[index];

      plugin.updatePlugin.call(plugin, this, pluginConfigArr);
    }
  }

  public initPlugin() {
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let index = 0; index < this.matmanConfig.plugins.length; index++) {
      const plugin = this.matmanConfig.plugins[index];

      plugin.initPlugin.call(plugin, this);
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

export interface IPipelineJsonData {
  pipelineMaterialFullPath: string;
  pluginConfigArr: any[];
}

export function setPipelineJsonDataToEnv(pipelineFromParams?: Pipeline): string {
  let pipeline: Pipeline;

  if (pipelineFromParams && pipelineFromParams instanceof Pipeline) {
    // 如果传入的参数就是 pipeline，则直接使用它
    pipeline = pipelineFromParams;
  } else {
    // 否则，优先去全局变量里面去找
    const pipelineFromGlobal = getPipelineFromGlobal();

    // 如果找不到 pipeline ，则直接返回
    if (!pipelineFromGlobal) {
      return '{}';
    }

    pipeline = pipelineFromGlobal;
  }

  const pipelineJsonData: IPipelineJsonData = {
    pipelineMaterialFullPath: pipeline.filename,
    pluginConfigArr: pipeline.matmanConfig.plugins,
  };

  const saveStr = JSON.stringify(pipelineJsonData);

  process.env.MATMAN_PIPELINE_JSON_DATA_STR = JSON.stringify(pipelineJsonData);

  return saveStr;
}

export function getPipelineJsonDataFromEnv(): IPipelineJsonData | null {
  const pipelineJsonDataStr = process.env.MATMAN_PIPELINE_JSON_DATA_STR ;

  if (!pipelineJsonDataStr) {
    return null;
  }

  try {
    return JSON.parse(pipelineJsonDataStr) as IPipelineJsonData;
  } catch (e) {
    return null;
  }
}

export function getPipelineFromGlobal(): Pipeline | null {
  // 全局变量中不一定存在
  if (!globalAny.matmanPipeline) {
    return null;
  }

  return globalAny.matmanPipeline as Pipeline;
}

export function getPipelineFromEnv(): Pipeline | null {
  // 优先去全局变量里面去找
  const pipelineInGlobal = getPipelineFromGlobal();
  if (pipelineInGlobal) {
    return pipelineInGlobal;
  }

  // 如果全局变量里面没有，则需要从 env 中获得
  const pipelineJsonData = getPipelineJsonDataFromEnv();
  if (!pipelineJsonData) {
    return null;
  }

  try {
    // 引入 pipeline material 模块
    const pipeline = requireModule(pipelineJsonData.pipelineMaterialFullPath) as Pipeline;

    // 更新插件
    pipeline.updatePlugin(pipelineJsonData.pluginConfigArr);

    return pipeline;
  } catch (e) {
    console.error(e);
    return null;
  }
}
