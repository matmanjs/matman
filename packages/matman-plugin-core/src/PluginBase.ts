import { CacheData, IPluginBase, IMaterialBase, Pipeline, ICurMaterial, IViewMaterials, IViewMaterialsGroup, IViewMaterialsFolder } from 'matman-core';

const globalAny: any = global;
export default class PluginBase implements IPluginBase {
  /**
   * 插件ID
   */
  public id: string;

  /**
   * 缓存数据
   */
  public cacheData: CacheData;

  /**
   * 序列号
   */
  public seqId: string;

  public constructor(id: string) {
    this.id = id;

    this.cacheData = new CacheData;

    this.seqId = `${this.id}-${Math.random()}`;
  }

  /**
   * 初始化插件
   */
  public initPlugin(pipeline: Pipeline): void {
    // 例如将相对路径修改为绝对路径等
    if (process.env.CONSOLE_E2E_RUNNER) {
      console.log(pipeline);
    }

    globalAny.matmanPipeline = pipeline;
  }

  /**
   * 更新插件
   */
  public updatePlugin(pipeline: Pipeline, pluginConfigArr: any[]): void {
    // 例如将相对路径修改为绝对路径等
    if (process.env.CONSOLE_E2E_RUNNER) {
      console.log(pipeline);
      console.log(pluginConfigArr);
    }

    globalAny.matmanPipeline = pipeline;
  }

  /**
   * 自动化测试之前执行
   */
  public async setup(pipeline: Pipeline): Promise<void> {
    // 例如 build 项目、启动代理、启动 mock server 等
    if (process.env.CONSOLE_E2E_RUNNER) {
      console.log(pipeline);
    }

    globalAny.matmanPipeline = pipeline;
  }

  /**
   * 执行自动化测试
   */
  public async runTest(pipeline: Pipeline): Promise<void> {
    // 例如 run test
    if (process.env.CONSOLE_E2E_RUNNER) {
      console.log(pipeline);
    }

    globalAny.matmanPipeline = pipeline;
  }

  /**
   * 自动化测试之后执行
   */
  public async teardown(pipeline: Pipeline): Promise<void> {
    // 例如清理工作、处理测试产物等
    if (process.env.CONSOLE_E2E_RUNNER) {
      console.log(pipeline);
    }

    globalAny.matmanPipeline = pipeline;
  }

  public setSeqId(seqId: string): void  {
    this.seqId = seqId;
  }

  public getCurMaterial(): ICurMaterial {
    return {};
  }

  public getViewMaterials(matmanRootPath: string): IViewMaterials {
    if (process.env.CONSOLE_E2E_RUNNER) {
      console.log(matmanRootPath);
    }

    return [];
  }

  public getViewMaterialsFromAllMaterial(
    allMaterial: IMaterialBase [],
    curMaterial: ICurMaterial,
  ): IViewMaterials {
    const pluginId = this.id;

    // 结果
    const list: IViewMaterials = [];

    // 遍历所有的物料
    allMaterial.forEach((item: IMaterialBase) => {
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
          pluginId,
          materialId: item.id,
          children: [],
          curMaterial,
        };


        groupItem.children.push(folderItem);
      }

      folderItem.children.push(item);
    });

    return list;
  }
}

