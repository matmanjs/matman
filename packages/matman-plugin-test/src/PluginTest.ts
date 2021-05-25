import path from 'path';
import { PluginBase } from 'matman-plugin-core';
import { E2ERunner, logger } from 'matman-core';

import { ITestDefinedInstance } from './types';

interface IPluginTestOpts {
  definedInstanceDir: string;
  activeInstance: string;
}

export default class PluginTest extends PluginBase {
  /**
   * 配置文件的目录
   */
  public definedInstanceDir: string;
  public activeInstance: string;

  public constructor(opts: IPluginTestOpts) {
    super('test');

    this.definedInstanceDir = opts.definedInstanceDir;
    this.activeInstance = opts.activeInstance;
  }

  /**
   * 初始化插件
   */
  public async initPlugin(e2eRunner: E2ERunner): Promise<void> {
    await super.initPlugin(e2eRunner);

    // 修改为绝对路径，方便后续处理
    this.definedInstanceDir = path.resolve(e2eRunner.matmanConfig.matmanRootPath, this.definedInstanceDir);
  }

  public async runTest(e2eRunner: E2ERunner) {
    await super.runTest(e2eRunner);

    logger.info('RunTest begin ...');

    // 获取当前激活的模块
    const activeInstance = this.getActiveInstance();
    if (activeInstance && typeof activeInstance.run === 'function') {
      await activeInstance.run.call(activeInstance);
    }

    logger.info('RunTest finished!');
  }

  public getActiveInstance(): ITestDefinedInstance | null {
    return getPluginTestMochaInstance(this.definedInstanceDir, this.activeInstance);
  }
}

export function getPluginTestMochaInstance(
  definedInstanceDir: string,
  activeInstance: string,
): ITestDefinedInstance | null {
  const targetActiveInstance = path.join(definedInstanceDir, activeInstance);
  const activeInstanceFullPath = path.resolve(targetActiveInstance);

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require(activeInstanceFullPath) as ITestDefinedInstance;
  } catch (err) {
    console.error('getPluginTestMochaInstance catch err', activeInstanceFullPath, err);

    return null;
  }
}
