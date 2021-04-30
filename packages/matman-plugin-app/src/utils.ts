/**
   * 构建业务工程项目
   *
   * @param cmd
   * @param opts
   */
export  async function buildProject(cmd: string | ((port: number) => string), opts?: BuildProjectOpts): Promise<string | number | undefined> {
  let cmdStr;

  // project 端口，其中来自环境变量的优先级最高，因为在自动化测试时可以动态设置
  let projectPort = process.env[DWT_PROCESS_ENV.PROJECT_PORT] || opts?.port;

  if (opts?.usePort) {
    logger.info('project 需要一个端口号！');

    if (projectPort) {
      // 如果存在被指定的端口，则将其转为数字
      if (typeof projectPort !== 'number') {
        projectPort = parseInt(`${projectPort}`, 10);
      }

      // 如果指定了端口，则杀掉这个端口
      await this.killPort(projectPort);
    } else {
      // 如果没有指定端口，则自动查找一个未被占用的端口
      projectPort = await this.findAvailablePort(3000);
    }

    logger.info(`project 即将使用端口号: ${projectPort}!`);

    cmdStr = getFromStrOrFunc<string, string | number>(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      cmd,
      projectPort,
    );

    // 缓存在本地
    saveUsedPort('project-build', projectPort, this.seqId);
  } else {
    cmdStr = getFromStrOrFunc<string, string | number>(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      cmd);
  }

  await this.runByExec('project-build', cmdStr, { cwd: opts?.cwd || this.workspacePath }, opts?.checkIfBuildCompleted);

  return projectPort;
}
