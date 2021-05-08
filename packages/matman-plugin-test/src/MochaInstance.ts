import { DefinedInstanceBase } from 'matman-plugin-core';

interface MochaInstanceOpts {
  cwd: string;
  mochawesomeJsonFilePath?: string;
}

export default class MochaInstance extends DefinedInstanceBase {
  public cmd: string;
  public cwd: string;
  public mochawesomeJsonFilePath?: string;


  public constructor(cmd: string, opts: MochaInstanceOpts) {
    super('Use Mocha');

    this.cmd = cmd;
    this.cwd = opts.cwd;
    this.mochawesomeJsonFilePath = opts.mochawesomeJsonFilePath;
  }
}
