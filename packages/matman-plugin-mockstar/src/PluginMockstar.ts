import { logger } from 'matman-core';
import { processHandler, util as cmdHubUtil } from 'cmd-hub';
import { checkIfMockstarStarted, generateConfigFile, IGenerateConfigFileOpts } from './utils';

interface IMockstarSDKOpts {
  seqId?: string;
  port?: number;
  useCurrentStartedMockstar?: boolean;
  forceOverride?: boolean;
}

export type ISetRulesOpts = IGenerateConfigFileOpts & {
  forceOverride?: boolean
};


const PROCESS_KEY = 'auto-mockstar-sdk';

export default class MockstarSDK {
  public seqId?: string;
  public port?: number;
  public useCurrentStartedMockstar?: boolean;
  public forceOverride?: boolean;

  constructor(opts?: IMockstarSDKOpts) {
    this.port = opts?.port;
    this.useCurrentStartedMockstar = opts?.useCurrentStartedMockstar;
    this.forceOverride = opts?.forceOverride;

    this.seqId = this.getSeqId(opts?.seqId);
  }

  /**
   * 启动 mockstar
   */
  public async start(): Promise<void> {
    logger.info('Ready to start mockstar ...');

    // 寻找并设置即将要占用的端口
    await this.findAndSetPort();

    // mockstar: 启动
    const startCmd = `npx mockstar run -p ${this.port}`;
    logger.info(startCmd);

    await cmdHubUtil.runCmd.runByExec(
      startCmd,
      {cwd: },
      data => data && data.indexOf(`127.0.0.1:${this.port}`) > -1,
    );

    // 自检一下 mockstar 是否真正启动了
    await checkIfMockstarStarted(this.port);

    logger.info('Start mockstar success!');
  }

  /**
   * 设置 mockstar rules
   */
  public async setRules(opts: ISetRulesOpts): Promise<void> {
    logger.info('Ready to set mockstar rules ...');

    // 需要生成一个本地文件，才方便后续 mockstar 直接使用该文件里面的规则来设置
    const generateConfigFileResult = await generateConfigFile(opts);
    const { fullPath } = generateConfigFileResult;

    // 使用 mockstar 的规则配置文件
    // w2 add xx/.mockstar.js -S mockstar-e2etest --force
    let useCmd = `w2 add ${fullPath} ${this.getCustomNamespaceArgs()}`;

    if (opts.forceOverride) {
      // 如果已经存在同名的规则，则可能会提示如下，此时若要覆盖，则使用 --force
      // Warning: The rule already exists, to override the content, add CLI option --force.
      useCmd = `${useCmd} --force`;
    }

    logger.info(useCmd);

    // 如若成功，则会打印如下：
    // Setting mockstar[127.0.0.1:9422] rules successful.
    await cmdHubUtil.runCmd.runByExec(
      useCmd,
      {},
    );

    // 注意，如果因为存在同名的规则，可能导致规则覆盖失败，这里无法判断出
    // 只能通过打印的日志来定位
    // TODO 可能需要增加检查代理是否设置成功，例如设置一个特殊的代理规则看能否命中

    logger.info('Set mockstar rules success!');
  }

  /**
   * 停止单个 mockstar 进程
   */
  public async stop(port?: number): Promise<void> {
    logger.info('Ready to stop mockstar ...');

    const targetPort = port || this.port;
    if (!targetPort) {
      logger.info('Skip to stop because mockstar port in unknown!');
      return;
    }

    await cmdHubUtil.port.killPort(targetPort);

    logger.info(`Stop mockstar(http://127.0.0.1:${targetPort}) success!`);
  }

  /**
   * 停止所有的 mockstar 进程
   */
  public async stopAll(): Promise<void> {
    logger.info('Ready to stop all mockstar ...');

    await processHandler.kill(PROCESS_KEY);

    logger.info('Stop all mockstar success!');
  }

  private async findAndSetPort() {
    // 启动 mockstar 所需要的端口号，其中来自环境变量的优先级最高，因为在自动化测试时可以动态设置
    this.port = parseInt(`${process.env.WHISTLE_PORT || this?.port || 0}`, 10);

    if (!this.port) {
      // 如果没有指定端口，则自动查找一个未被占用的端口
      this.port = await cmdHubUtil.port.findAvailablePort(9421);
    }

    logger.info(`Mockstar port is ${this.port}`);

    // 在使用之前，尝试杀掉该端口
    await cmdHubUtil.port.killPort(this.port);
  }

  private getStorageDir(): string {
    // 需要追加一个 seqId，生成唯一的命名空间，以便独立
    return `${encodeURIComponent(PROCESS_KEY)}-${this.seqId}`;
  }

  private getSeqId(seqId?: string): string {
    // 来自环境变量的优先级最高，因为在自动化测试时可以动态设置
    if (process.env.WHISTLE_SEQ_ID) {
      return process.env.WHISTLE_SEQ_ID;
    }

    if (seqId) {
      return seqId;
    }

    const date = new Date();

    return [
      date.getFullYear(),
      date.getMonth() + 1,
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds(),
      (Math.random() * 10000).toFixed(0),
    ].join('-');
  }

  private getCustomNamespaceArgs(): string {
    return this.useCurrentStartedMockstar ? '' : `-S ${this.getStorageDir()}`;
  }
}
