import { DefinedInstanceBase } from 'matman-plugin-core';
import { util as cmdHubUtil } from 'cmd-hub';

import { ITestDefinedInstance } from './types';

interface MochaInstanceOpts {
  cwd: string;
  mochawesomeJsonFilePath?: string;
}

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

    // 执行命令
    await cmdHubUtil.runCmd.runByExec(this.cmd, {
      cwd: this.cwd,
    });
  }
}
