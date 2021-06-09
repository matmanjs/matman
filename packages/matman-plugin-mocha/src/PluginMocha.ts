import path from 'path';
import { PluginBase, getFileItemFromDir, IFSHandlerItem, requireModule } from 'matman-plugin-core';
import { Pipeline, logger } from 'matman-core';

import PluginMochaMaterial from './PluginMochaMaterial';

interface IPluginMochaOpts {
  materialDir: string;
  activated: string;
}

export default class PluginMocha extends PluginBase {
  /**
   * 配置文件的目录
   */
  public materialDir: string;
  public activated: string;

  public constructor(opts: IPluginMochaOpts) {
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

  public getActivatedMaterial(): PluginMochaMaterial | null {
    return getPluginMochaMaterial(path.join(this.materialDir, this.activated));
  }

  public getAllMaterial(): PluginMochaMaterial [] {
    const all = getFileItemFromDir(this.materialDir);

    const result: PluginMochaMaterial[] = [];

    all.forEach((fileItem: IFSHandlerItem) => {
      const item = getPluginMochaMaterial(path.join(this.materialDir, fileItem.relativePath));
      if (item) {
        result.push(item);
      }
    });

    return result;
  }
}

export function getPluginMochaMaterial(activatedFullPath: string): PluginMochaMaterial | null {
  try {
    const requiredResult = requireModule(activatedFullPath);
    const result = (typeof requiredResult === 'function') ? requiredResult() : requiredResult;

    return result as PluginMochaMaterial;
  } catch (err) {
    console.error('getPluginMochaMaterial catch err', activatedFullPath, err);

    return null;
  }
}
