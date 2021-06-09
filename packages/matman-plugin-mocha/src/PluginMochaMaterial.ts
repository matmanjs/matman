import { MaterialBase } from 'matman-plugin-core';
import { setPipelineJsonDataToEnv } from 'matman-core';
import { util as cmdHubUtil } from 'cmd-hub';


interface MochaInstanceOpts {
  cwd: string;
  mochawesomeJsonFilePath?: string;
}

export default class PluginMochaMaterial extends MaterialBase {
  public cmd: string;
  public cwd: string;
  public mochawesomeJsonFilePath?: string;


  public constructor(name: string, cmd: string, opts: MochaInstanceOpts) {
    super(name, __filename);

    this.cmd = cmd;
    this.cwd = opts.cwd;
    this.mochawesomeJsonFilePath = opts.mochawesomeJsonFilePath;
  }

  public async run(): Promise<void> {
    console.log('==run test===', this.cmd);

    const pipelineJsonDataStr = setPipelineJsonDataToEnv();
    if (!pipelineJsonDataStr) {
      throw new Error('Some wrong in setPipelineJsonDataToEnv()!');
    }

    // 执行命令
    await cmdHubUtil.runCmd.runByExec(this.cmd, {
      cwd: this.cwd,
    });
  }
}
