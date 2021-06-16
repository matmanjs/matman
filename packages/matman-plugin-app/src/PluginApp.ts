import path from 'path';
import { PluginBase, getFileItemFromDir, IFSHandlerItem } from 'matman-plugin-core';
import { Pipeline } from 'matman-core';

import { buildApp, IBuildAppCmd, IBuildAppOpts } from './utils';
import PluginAppMaterial, { getPluginAppMaterial } from './PluginAppMaterial';

interface IPluginAppOpts {
  materialDir: string;
  curMaterial: string;
}

export default class PluginApp extends PluginBase {
  /**
   * 配置文件的目录
   */
  public materialDir: string;
  public curMaterial: PluginAppMaterial | null;

  /**
   * 业务工程项目的根目录
   */
  public cwd?: string;

  public constructor(opts: IPluginAppOpts) {
    super('PluginApp');

    this.materialDir = opts.materialDir;
    this.curMaterial = null;
  }

  /**
   * 初始化插件
   */
  public initPlugin(pipeline: Pipeline): void {
    super.initPlugin(pipeline);

    // 设置当前使用的物料
    if (pipeline.opts?.pluginAppCurMaterial) {
      this.curMaterial = pipeline.opts?.pluginAppCurMaterial as PluginAppMaterial;
    }

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

    // 如果定义了 setup 方法，则调用执行它
    if (this.curMaterial && typeof this.curMaterial.setup === 'function') {
      await this.curMaterial.setup.call(this.curMaterial, this);
    }
  }

  public getCurMaterial(): PluginAppMaterial | null {
    return this.curMaterial;
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
