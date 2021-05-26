import path from 'path';
import { PluginBase, getAllDefinedInstances } from 'matman-plugin-core';
import { E2ERunner } from 'matman-core';

import { buildApp, IBuildAppCmd, IBuildAppOpts } from './utils';
import PluginAppInstance, { getPluginAppInstance } from './PluginAppInstance';

interface IPluginAppOpts {
  definedInstanceDir: string;
  activeInstance: string;
}

export default class PluginApp extends PluginBase {
  /**
   * 配置文件的目录
   */
  public definedInstanceDir: string;
  public activeInstance: string;

  /**
   * 业务工程项目的根目录
   */
  public cwd?: string;

  public constructor(opts: IPluginAppOpts) {
    super('app');

    this.definedInstanceDir = opts.definedInstanceDir;
    this.activeInstance = opts.activeInstance;
  }

  /**
   * 初始化插件
   */
  public initPlugin(e2eRunner: E2ERunner): void {
    super.initPlugin(e2eRunner);

    // 修改为绝对路径，方便后续处理
    this.definedInstanceDir = path.resolve(e2eRunner.matmanConfig.matmanRootPath, this.definedInstanceDir);
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

  public async setup(e2eRunner: E2ERunner): Promise<void> {
    await super.setup(e2eRunner);

    // 获取当前激活的模块
    const activeInstance = this.getActiveInstance();
    if (activeInstance && typeof activeInstance.setup === 'function') {
      await activeInstance.setup.call(activeInstance, this);
    }
  }

  public getActiveInstance(): PluginAppInstance | null {
    return getPluginAppInstance(this.definedInstanceDir, this.activeInstance);
  }

  public getAllDefinedInstances(): PluginAppInstance [] {
    const all = getAllDefinedInstances(this.definedInstanceDir);

    const result: PluginAppInstance[] = [];

    all.forEach((element: any) => {
      result.push(typeof element === 'function' ? element() : element);
    });

    return result;
  }
}
