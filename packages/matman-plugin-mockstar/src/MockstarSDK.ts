import { logger } from 'matman-core';
import { util as cmdHubUtil } from 'cmd-hub';

import { startServer } from 'mockstar-local-server';

interface IMockstarSDKOpts {
  port?: number;
}

export default class MockstarSDK {
  public port?: number;

  public runServer?: any;

  constructor(opts?: IMockstarSDKOpts) {
    this.port = opts?.port;
  }

  /**
   * 启动 mockstar
   */
  public async start(): Promise<void> {
    logger.info('Ready to start mockstar ...');

    // 寻找并设置即将要占用的端口
    await this.findAndSetPort();

    // mockstar: 启动
    const configOpts = {
      port: this.port,
      rootPath: '/Users/helinjiang/gitprojects/matman/debug-v7-demo/matman-app',
      mockServerPath: '/Users/helinjiang/gitprojects/matman/debug-v7-demo/matman-app/src/plugins/mockstar/modules',
    };

    this.runServer = startServer(configOpts, (isSuccess, data) => {
      console.log('startServer callback', isSuccess, data);
    });


    logger.info('Start mockstar success!');
  }

  /**
   * 停止单个 mockstar 进程
   */
  public async stop(port?: number): Promise<void> {
    logger.info('Ready to stop mockstar ...');

    if (this.runServer) {
      this.runServer.stop(() => {
        console.log('Mockstar stop server success!');
      });
    }

    const targetPort = port || this.port;
    if (!targetPort) {
      logger.info('Skip to stop because mockstar port in unknown!');
      return;
    }

    await cmdHubUtil.port.killPort(targetPort);

    logger.info(`Stop mockstar(http://127.0.0.1:${targetPort}) success!`);
  }


  private async findAndSetPort() {
    // 启动 mockstar 所需要的端口号，其中来自环境变量的优先级最高，因为在自动化测试时可以动态设置
    this.port = parseInt(`${process.env.MOCKSTAR_PORT || this?.port || 0}`, 10);

    if (!this.port) {
      // 如果没有指定端口，则自动查找一个未被占用的端口
      this.port = await cmdHubUtil.port.findAvailablePort(9421);
    }

    logger.info(`Mockstar port is ${this.port}`);

    // 在使用之前，尝试杀掉该端口
    await cmdHubUtil.port.killPort(this.port);
  }
}
