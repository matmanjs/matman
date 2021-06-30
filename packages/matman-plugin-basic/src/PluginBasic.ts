import path from 'path';
import { PluginBase, findAllMaterialFileItems } from 'matman-plugin-core';
import { Pipeline, IMaterialFileItem } from 'matman-core';

import UserActionMaterial, { getUserActionMaterial } from './UserActionMaterial';

interface IPluginBasicOpts {
  userActionMaterialDir: string;
  webCrawlerMaterialDir: string;
}

export default class PluginBasic extends PluginBase {
  public userActionMaterialDir: string;
  public webCrawlerMaterialDir: string;

  public constructor(opts: IPluginBasicOpts) {
    super('PluginBasic');

    this.userActionMaterialDir = opts.userActionMaterialDir;
    this.webCrawlerMaterialDir = opts.webCrawlerMaterialDir;
  }

  /**
   * 初始化插件
   */
  public initPlugin(pipeline: Pipeline): void {
    super.initPlugin(pipeline);


    // 修改为绝对路径，方便后续处理
    this.userActionMaterialDir = path.resolve(pipeline.matmanConfig.matmanRootPath, this.userActionMaterialDir);
    this.webCrawlerMaterialDir = path.resolve(pipeline.matmanConfig.matmanRootPath, this.webCrawlerMaterialDir);
  }

  // TODO 不仅是 UserActionMaterial，还有其他的
  public getAllMaterial(matmanRootPath: string): UserActionMaterial [] {
    const result: UserActionMaterial[] = [];

    const all = findAllMaterialFileItems(matmanRootPath, this.userActionMaterialDir);
    all.forEach((materialFileItem: IMaterialFileItem) => {
      const item = getUserActionMaterial(materialFileItem.fullPath);
      if (item) {
        item.materialFileItem = materialFileItem;
        result.push(item);
      }
    });

    return result;
  }
}

