import { DefinedInstanceBase } from 'matman-plugin-core';
import { util as cmdHubUtil } from 'cmd-hub';


import { E2ERunner } from 'matman-core';

import { ITestDefinedInstance } from './types';

interface MochaInstanceOpts {
  cwd: string;
  mochawesomeJsonFilePath?: string;
}

const globalAny: any = global;

export default class PluginTestMochaInstance extends DefinedInstanceBase implements ITestDefinedInstance {
  public cmd: string;
  public cwd: string;
  public mochawesomeJsonFilePath?: string;


  public constructor(cmd: string, opts: MochaInstanceOpts) {
    super('Use Mocha');

    this.cmd = cmd;
    this.cwd = opts.cwd;
    this.mochawesomeJsonFilePath = opts.mochawesomeJsonFilePath;
  }

  public async run(): Promise<void> {
    console.log('==run test===', this.cmd);

    // 该参数为全局参数
    if (!globalAny.matmanE2ERunner) {
      return;
    }

    const e2eRunner = globalAny.matmanE2ERunner as E2ERunner;
    const pluginJsonData: {[key: string]: any} = {
      extraInfo: {
        matmanRootPath: e2eRunner.matmanConfig.matmanRootPath,
      },
    };

    const pluginApp = e2eRunner.matmanConfig.getPlugin('app') ;
    if (pluginApp) {
      pluginJsonData.pluginApp = pluginApp;
    }

    const pluginWhistle = e2eRunner.matmanConfig.getPlugin('whistle') ;
    if (pluginWhistle) {
      pluginJsonData.pluginWhistle = pluginWhistle;
    }

    const pluginMockstar = e2eRunner.matmanConfig.getPlugin('mockstar') ;
    if (pluginMockstar) {
      pluginJsonData.pluginMockstar = pluginMockstar;
    }

    console.log('=====pluginJsonData===', JSON.stringify(pluginJsonData, null, 2));

    process.env.MATMAN_TMP_PLUGIN_JSON_DATA = JSON.stringify(pluginJsonData);

    // 执行命令
    await cmdHubUtil.runCmd.runByExec(this.cmd, {
      cwd: this.cwd,
    });
  }
}
