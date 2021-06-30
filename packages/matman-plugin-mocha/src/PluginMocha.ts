import path from 'path';
import { PluginBase, findAllMaterialFileItems, requireModule } from 'matman-plugin-core';
import { Pipeline, logger, IMaterialFileItem, ICurMaterial } from 'matman-core';

import PluginMochaMaterial from './PluginMochaMaterial';

interface IPluginMochaOpts {
  materialDir: string;
}

export default class PluginMocha extends PluginBase {
  /**
   * 配置文件的目录
   */
  public materialDir: string;
  public curMaterial: PluginMochaMaterial | null;

  public constructor(opts: IPluginMochaOpts) {
    super('PluginMocha');

    this.materialDir = opts.materialDir;
    this.curMaterial = null;
  }

  /**
   * 初始化插件
   */
  public initPlugin(pipeline: Pipeline): void {
    super.initPlugin(pipeline);

    // 设置当前使用的物料
    if (pipeline.opts?.pluginMochaCurMaterial) {
      this.curMaterial = pipeline.opts?.pluginMochaCurMaterial as PluginMochaMaterial;
    }

    // 修改为绝对路径，方便后续处理
    this.materialDir = path.resolve(pipeline.matmanConfig.matmanRootPath, this.materialDir);
  }

  public async runTest(pipeline: Pipeline) {
    await super.runTest(pipeline);

    logger.info('RunTest begin ...');

    // 如果定义了 run 方法，则调用执行它
    if (this.curMaterial && typeof this.curMaterial.run === 'function') {
      await this.curMaterial.run.call(this.curMaterial);
    }

    logger.info('RunTest finished!');
  }

  public getCurMaterial(): ICurMaterial {
    const result: ICurMaterial = {};

    if (this.curMaterial) {
      result.PluginAppMaterial = this.curMaterial;
    }

    return result;
  }

  public getAllMaterial(matmanRootPath: string): PluginMochaMaterial [] {
    const result: PluginMochaMaterial[] = [];

    const all = findAllMaterialFileItems(matmanRootPath, this.materialDir);
    all.forEach((materialFileItem: IMaterialFileItem) => {
      const item = getPluginMochaMaterial(materialFileItem.fullPath);
      if (item) {
        item.materialFileItem = materialFileItem;
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
