
import { logger } from 'matman-core';
import { util as cmdHubUtil } from 'cmd-hub';
import { ChildProcess, ExecOptions } from 'child_process';

export interface IBuildAppOpts {
  cwd?: string;
  port?: number | string;
  usePort?: boolean;
  checkIfBuildCompleted?: (stdoutData: string) => boolean,
}

export type IBuildAppCmd = string | ((port?: number) => string);

export interface IStartWhistleOpts {
  seqId?: string;
  port?: number;
  useCurrentStartedWhistle?: boolean;
}

/**
   * 构建业务工程项目
   *
   * @param cmd
   * @param opts
   */
export async function startWhistle(opts: IStartWhistleOpts): Promise<number> {
  // 启动 whistle 所需要的端口号，其中来自环境变量的优先级最高，因为在自动化测试时可以动态设置
  let whistlePort = parseInt(`${process.env.MATMAN_PLUGIN_WHISTLE_PORT || opts?.port || 0}`, 10);


  if (whistlePort) {
    // 如果指定了端口，则杀掉这个端口
    await cmdHubUtil.port.killPort(whistlePort);
  } else {
    // 如果没有指定端口，则自动查找一个未被占用的端口
    whistlePort = await cmdHubUtil.port.findAvailablePort(9421);
  }

  // 需要追加一个 seqId，为本次 whistle 生成唯一的命名空间
  const processKey = `${encodeURIComponent('whistle-start')}-${opts.seqId}`;

  const whistleCustomNamespaceArgs = opts.useCurrentStartedWhistle ? '' : `-S ${processKey}`;


  // whistle: 启动
  await runByExec(
    'whistle-start',
    `w2 start ${whistleCustomNamespaceArgs} -p ${whistlePort}`,
    {},
    data => data && data.indexOf(`127.0.0.1:${whistlePort}`) > -1,
  );

  // 自检一下 whistle 是否真正启动了
  const checkURL = `http://127.0.0.1:${whistlePort}/cgi-bin/server-info`;
  await cmdHubUtil.base.checkAndWaitURLAvailable(checkURL, { debug: true }).catch((err) => {
    const errMsg = err?.message || err;

    return Promise.reject(`检测 whistle 未成功启动, checkURL=${checkURL}, err=${errMsg}`);
  });


  return whistlePort;
}


/**
   * 使用子进程来执行指定的命令
   *
   * @param {String} name 命令的名字，用于自定义识别命令，不同命令之间请保持唯一
   * @param {String} command 要执行的命令
   * @param {ExecOptions} options 执行命令的额外参数
   * @param {Function} customCloseHandler 自定义关闭函数，若返回 true 则会强制中断子进程
   */
async function  runByExec(
  name: string,
  command: string,
  options?: ExecOptions,
  customCloseHandler?: (data: any) => boolean,
): Promise<ChildProcess> {
  // 进程中追加一些唯一标识
  // const processKey = `${encodeURIComponent(name)}-${this.seqId}`;

  // 如果命令行中没有 processKey 则追加之
  // const cmd = command.indexOf(processKey) < 0 ? `${command} --${processKey}` : command;
  // 暂时不追加，追加似乎无意义
  const cmd = command;

  // 缓存进程记录
  // this.cacheProcessArr.push({
  //   t: Date.now(),
  //   originalCmd: command,
  //   processKey,
  //   cmd,
  // });

  logger.info(`即将为 ${name} 执行：${cmd}`);

  // 执行命令
  const cmdRun = await cmdHubUtil.runCmd.runByExec(cmd, options, customCloseHandler);

  // 此次执行的进程缓存在本地
  // saveUsedPid(name, cmdRun.pid, this.seqId, cmd);

  return cmdRun;
}
