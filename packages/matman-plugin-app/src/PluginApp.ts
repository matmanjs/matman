import { PluginBase } from 'matman-plugin-core';
import { E2ERunner } from 'matman-core';

import { buildApp, IBuildAppCmd, IBuildAppOpts } from './utils';
import PluginAppInstance, { getPluginAppInstance } from './PluginAppInstance';

interface IPluginAppOpts {
  definedInstanceDir: string;
  activeInstance: string;
}

const globalAny: any = global;

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
    if (!globalAny.matmanE2ERunner) {
      return null;
    }

    const e2eRunner = globalAny.matmanE2ERunner as E2ERunner;

    return getPluginAppInstance(e2eRunner.matmanConfig.matmanRootPath, this.definedInstanceDir, this.activeInstance);
  }
}
