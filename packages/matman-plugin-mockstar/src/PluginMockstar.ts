import path from 'path';
import _ from 'lodash';
import { PluginBase } from 'matman-plugin-core';
import { Pipeline } from 'matman-core';

import MockstarSDK, { IStartOpts } from './MockstarSDK';

interface IPluginMockstarOpts {
  mockerDir: string;
  materialDir: string;
  port?: number;
  startOpts?: IStartOpts;
}

export default class PluginMockstar extends PluginBase {
  public mockerDir: string;
  public materialDir: string;
  public startOpts?: IStartOpts;
  private readonly mockstarSDK: MockstarSDK;

  public constructor(opts: IPluginMockstarOpts) {
    super('mockstar');

    this.mockerDir = opts.mockerDir;
    this.materialDir = opts.materialDir;
    this.startOpts = opts.startOpts;

    this.mockstarSDK = new MockstarSDK({
      port: parseInt(`${process.env.MATMAN_PLUGIN_MOCKSTAR_PORT || opts?.port || 0}`, 10),
    });
  }

  /**
   * 初始化插件
   */
  public initPlugin(pipeline: Pipeline): void {
    super.initPlugin(pipeline);

    // 修改为绝对路径，方便后续处理
    this.materialDir = path.resolve(
      pipeline.matmanConfig.matmanRootPath,
      this.materialDir,
    );
    this.mockerDir = path.resolve(pipeline.matmanConfig.matmanRootPath, this.mockerDir);
  }

  public async setup(pipeline: Pipeline) {
    await super.setup(pipeline);

    // 设置默认值
    this.startOpts = _.merge(
      {
        rootPath: pipeline.matmanConfig.matmanRootPath,
        mockServerPath: this.mockerDir,
      },
      this.startOpts,
    );

    // 启动 mockstar
    await this.mockstarSDK.start(this.startOpts);

    // 缓存一下 mockstar 的端口
    this.cacheData.setCacheItem('port', this.mockstarSDK.port);
  }

  public async teardown(pipeline: Pipeline) {
    await super.teardown(pipeline);

    // 停止 mockstar
    await this.mockstarSDK.stop();
  }
}