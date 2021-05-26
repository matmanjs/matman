import path from 'path';
import _ from 'lodash';
import { PluginBase } from 'matman-plugin-core';
import { E2ERunner } from 'matman-core';

import MockstarSDK, { IStartOpts } from './MockstarSDK';

interface IPluginMockstarOpts {
  mockerDir: string;
  definedInstanceDir: string;
  port?: number;
  startOpts?: IStartOpts;
}

export default class PluginMockstar extends PluginBase {
  public mockerDir: string;
  public definedInstanceDir: string;
  public startOpts?: IStartOpts;
  private readonly mockstarSDK: MockstarSDK;

  public constructor(opts: IPluginMockstarOpts) {
    super('mockstar');

    this.mockerDir = opts.mockerDir;
    this.definedInstanceDir = opts.definedInstanceDir;
    this.startOpts = opts.startOpts;

    this.mockstarSDK = new MockstarSDK({
      port: parseInt(`${process.env.MATMAN_PLUGIN_MOCKSTAR_PORT || opts?.port || 0}`, 10),
    });
  }

  /**
   * 初始化插件
   */
  public async initPlugin(e2eRunner: E2ERunner): Promise<void> {
    await super.initPlugin(e2eRunner);

    // 修改为绝对路径，方便后续处理
    this.definedInstanceDir = path.resolve(
      e2eRunner.matmanConfig.matmanRootPath,
      this.definedInstanceDir,
    );
    this.mockerDir = path.resolve(e2eRunner.matmanConfig.matmanRootPath, this.mockerDir);
  }

  public async setup(e2eRunner: E2ERunner) {
    await super.setup(e2eRunner);

    // 设置默认值
    this.startOpts = _.merge(
      {
        rootPath: e2eRunner.matmanConfig.matmanRootPath,
        mockServerPath: this.mockerDir,
      },
      this.startOpts,
    );

    // 启动 mockstar
    await this.mockstarSDK.start(this.startOpts);

    // 缓存一下 mockstar 的端口
    this.cacheData.setCacheItem('port', this.mockstarSDK.port);
  }

  public async teardown(e2eRunner: E2ERunner) {
    await super.teardown(e2eRunner);

    // 停止 mockstar
    await this.mockstarSDK.stop();
  }
}
