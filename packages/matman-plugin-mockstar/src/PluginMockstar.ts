import path from 'path';
import _ from 'lodash';
import { PluginBase, findAllMaterialFileItems } from 'matman-plugin-core';
import { Pipeline, IMaterialFileItem, IViewMaterials, IViewMaterialsGroup, IViewMaterialsFolder, ICurMaterial } from 'matman-core';

import MockstarSDK, { IStartOpts } from './MockstarSDK';
import PluginMockstarMaterial, { getPluginMockstarMaterial } from './PluginMockstarMaterial';

interface IPluginMockstarOpts {
  mockerDir: string;
  materialDir: string;
  port?: number;
  startOpts?: IStartOpts;
}

export default class PluginMockstar extends PluginBase {
  public mockerDir: string;
  public materialDir: string;
  public startOpts?: IStartOpts;
  private readonly mockstarSDK: MockstarSDK;

  public constructor(opts: IPluginMockstarOpts) {
    super('PluginMockstar');

    this.mockerDir = opts.mockerDir;
    this.materialDir = opts.materialDir;
    this.startOpts = opts.startOpts;

    this.mockstarSDK = new MockstarSDK({
      port: parseInt(`${process.env.MATMAN_PLUGIN_MOCKSTAR_PORT || opts?.port || 0}`, 10),
    });
  }

  /**
   * 初始化插件
   */
  public initPlugin(pipeline: Pipeline): void {
    super.initPlugin(pipeline);

    // 修改为绝对路径，方便后续处理
    this.materialDir = path.resolve(pipeline.matmanConfig.matmanRootPath, this.materialDir);
    this.mockerDir = path.resolve(pipeline.matmanConfig.matmanRootPath, this.mockerDir);
  }

  public async setup(pipeline: Pipeline) {
    await super.setup(pipeline);

    // 设置默认值
    this.startOpts = _.merge(
      {
        rootPath: pipeline.matmanConfig.matmanRootPath,
        mockServerPath: this.mockerDir,
      },
      this.startOpts,
    );

    // 启动 mockstar
    await this.mockstarSDK.start(this.startOpts);

    // 缓存一下 mockstar 的端口
    this.cacheData.setCacheItem('port', this.mockstarSDK.port);
  }

  public async teardown(pipeline: Pipeline) {
    await super.teardown(pipeline);

    // 停止 mockstar
    await this.mockstarSDK.stop();
  }

  public getAllMaterial(matmanRootPath: string): PluginMockstarMaterial [] {
    const result: PluginMockstarMaterial[] = [];

    const all = findAllMaterialFileItems(matmanRootPath, this.materialDir);
    all.forEach((materialFileItem: IMaterialFileItem) => {
      const item = getPluginMockstarMaterial(materialFileItem.fullPath);
      if (item) {
        item.materialFileItem = materialFileItem;
        result.push(item);
      }
    });

    return result;
  }

  public getViewMaterials(matmanRootPath: string): IViewMaterials {
    return this.getViewMaterials2(this.id, this.getAllMaterial(matmanRootPath));
  }

  public getViewMaterials2(pluginName: string, allMaterial: PluginMockstarMaterial [], curMaterial?: ICurMaterial): IViewMaterials {
    const list: IViewMaterials = [];

    console.log('---curMaterial---', curMaterial);

    allMaterial.forEach((item: PluginMockstarMaterial) => {
      if (!item.materialFileItem) {
        return;
      }

      // group
      const groupDesc = item.materialFileItem.groupName;
      let groupItem: IViewMaterialsGroup = list.filter(i => i.desc === groupDesc)[0];
      if (!groupItem) {
        groupItem = {
          desc: groupDesc,
          type: 'group',
          children: [],
        };

        list.push(groupItem);
      }


      // folder
      const folderDesc = item.materialFileItem.folderName;
      let folderItem: IViewMaterialsFolder = groupItem.children.filter(i => i.desc === folderDesc)[0];
      if (!folderItem) {
        folderItem = {
          desc: folderDesc,
          type: 'folder',
          pluginName,
          materialName: '',
          children: [],
          curMaterial: null,
        };


        groupItem.children.push(folderItem);
      }

      folderItem.children.push(item);
    });

    return list;
  }
}
