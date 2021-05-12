import path from 'path';
import { PluginBase } from 'matman-plugin-core';
import { E2ERunner, logger } from 'matman-core';

import { ITestDefinedInstance } from './types';

interface IPluginTestOpts {
  definedInstanceDir: string;
  activeInstance: string;
}

const globalAny: any = global;

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
    if (!globalAny.matmanE2ERunner) {
      return null;
    }

    const e2eRunner = globalAny.matmanE2ERunner as E2ERunner;

    return getPluginTestMochaInstance(
      e2eRunner.matmanConfig.matmanRootPath,
      this.definedInstanceDir,
      this.activeInstance,
    );
  }
}

export function getPluginTestMochaInstance(
  matmanRootPath: string,
  definedInstanceDir: string,
  activeInstance: string,
): ITestDefinedInstance | null {
  if (!matmanRootPath) {
    return null;
  }

  const targetActiveInstance = path.join(definedInstanceDir, activeInstance);
  const activeInstanceFullPath = path.resolve(matmanRootPath, targetActiveInstance);

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require(activeInstanceFullPath) as ITestDefinedInstance;
}
