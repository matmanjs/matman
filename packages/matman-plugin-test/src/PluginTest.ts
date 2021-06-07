import path from 'path';
import { PluginBase, getFileItemFromDir, IFSHandlerItem, requireModule } from 'matman-plugin-core';
import { Pipeline, logger } from 'matman-core';

import { IPluginTestMaterial } from './types';

interface IPluginTestOpts {
  materialDir: string;
  activated: string;
}

export default class PluginTest extends PluginBase {
  /**
   * 配置文件的目录
   */
  public materialDir: string;
  public activated: string;

  public constructor(opts: IPluginTestOpts) {
    super('test');

    this.materialDir = opts.materialDir;
    this.activated = opts.activated;
  }

  /**
   * 初始化插件
   */
  public initPlugin(pipeline: Pipeline): void {
    super.initPlugin(pipeline);

    // 修改为绝对路径，方便后续处理
    this.materialDir = path.resolve(pipeline.matmanConfig.matmanRootPath, this.materialDir);
  }

  public async runTest(pipeline: Pipeline) {
    await super.runTest(pipeline);

    logger.info('RunTest begin ...');

    // 获取当前激活的物料
    const activated = this.getActivatedMaterial();
    if (activated && typeof activated.run === 'function') {
      await activated.run.call(activated);
    }

    logger.info('RunTest finished!');
  }

  public getActivatedMaterial(): IPluginTestMaterial | null {
    return getPluginTestMochaMaterial(path.join(this.materialDir, this.activated));
  }

  public getAllMaterial(): IPluginTestMaterial [] {
    const all = getFileItemFromDir(this.materialDir);

    const result: IPluginTestMaterial[] = [];

    all.forEach((fileItem: IFSHandlerItem) => {
      const item = getPluginTestMochaMaterial(path.join(this.materialDir, fileItem.relativePath));
      if (item) {
        result.push(item);
      }
    });

    return result;
  }
}

export function getPluginTestMochaMaterial(activatedFullPath: string): IPluginTestMaterial | null {
  try {
    const requiredResult = requireModule(activatedFullPath);
    const result = (typeof requiredResult === 'function') ? requiredResult() : requiredResult;

    return result as IPluginTestMaterial;
  } catch (err) {
    console.error('getPluginTestMochaMaterial catch err', activatedFullPath, err);

    return null;
  }
}
