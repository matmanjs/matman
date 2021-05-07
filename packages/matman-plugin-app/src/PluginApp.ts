import path from 'path';
import { PluginBase } from 'matman-plugin-core';

import { buildApp } from './utils';

interface IPluginAppOpts {
  definedInstanceDir: string
}

export default class PluginApp extends PluginBase {
  /**
   * 配置文件的目录
   */
  public definedInstanceDir: string;

  /**
   * 业务工程项目的根目录
   */
  public cwd?: string;

  /**
   * 序列号
   */
  public seqId: string;


  public constructor(opts: IPluginAppOpts) {
    super('app');

    this.definedInstanceDir = opts.definedInstanceDir;
    this.seqId = `${this.name}-${Math.random()}`;
  }

  public setSeqId(seqId: string) {
    this.seqId = seqId;
  }

  /**
   * 构建业务工程项目
   */
  public async build() {
    // TODO 该值从 setting.json 中的 plugins.app.activeInstance 获取对应的配置读取
    const cmd = (port?: number) => `npx cross-env ENABLE_E2E_TEST=1 PORT=${port} npm start`;

    // TODO 读取配置
    const rootPath = path.resolve('/Users/helinjiang/gitprojects/matman-v7-demo');

    // TODO 读取配置
    const opts = {
      cwd: rootPath,
      port: process.env.PROJECT_PORT,
      usePort: true,
      checkIfBuildCompleted: (stdoutData: string) => !!(stdoutData && stdoutData.indexOf('Compiled successfully') > -1),
    } ;


    return buildApp(cmd, opts);
  }

  public async setup() {
    // TODO 从 instance 里面读取 setup 方法并执行

    await this.build();
  }
}
