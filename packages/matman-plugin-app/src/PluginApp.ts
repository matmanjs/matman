import path from 'path';
import { PluginBase, getFileItemFromDir, IFSHandlerItem } from 'matman-plugin-core';
import { Pipeline } from 'matman-core';

import { buildApp, IBuildAppCmd, IBuildAppOpts } from './utils';
import PluginAppMaterial, { getPluginAppMaterial } from './PluginAppMaterial';

interface IPluginAppOpts {
  materialDir: string;
  activated: string;
}

export default class PluginApp extends PluginBase {
  /**
   * 配置文件的目录
   */
  public materialDir: string;
  public activated: string;

  /**
   * 业务工程项目的根目录
   */
  public cwd?: string;

  public constructor(opts: IPluginAppOpts) {
    super('app');

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

  /**
   * 构建业务工程项目
   */
  public async build(cmd: IBuildAppCmd, opts?: IBuildAppOpts): Promise<void>  {
    const appPort = await buildApp(cmd, opts);

    if (appPort) {
      this.cacheData.setCacheItem('port', appPort);
    }
  }

  public async setup(pipeline: Pipeline): Promise<void> {
    await super.setup(pipeline);

    // 获取当前激活的物料
    const activated = this.getActivatedMaterial();
    if (activated && typeof activated.setup === 'function') {
      await activated.setup.call(activated, this);
    }
  }

  public getActivatedMaterial(): PluginAppMaterial | null {
    return getPluginAppMaterial(path.join(this.materialDir, this.activated));
  }

  public getAllMaterial(): PluginAppMaterial [] {
    const all = getFileItemFromDir(this.materialDir);

    const result: PluginAppMaterial[] = [];

    all.forEach((fileItem: IFSHandlerItem) => {
      const item = getPluginAppMaterial(path.join(this.materialDir, fileItem.relativePath));
      if (item) {
        result.push(item);
      }
    });

    return result;
  }
}
