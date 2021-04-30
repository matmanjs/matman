import {
  exec,
  spawn,
  SpawnOptionsWithoutStdio,
  ChildProcessWithoutNullStreams,
  ExecOptions,
  ChildProcess,
} from 'child_process';

import { createDebug, createLogger, LOG_TAG_NAME } from './logger';

const loggerCmd = {
  stdout: createDebug(`${LOG_TAG_NAME}:stdout`),
  stderr: createDebug(`${LOG_TAG_NAME}:stderr`),
};

const logger = createLogger('run-cmd');


/**
 * 使用 spawn 来执行指定的命令
 * @param {String} command
 * @param {Object} args
 * @param {Object} [options]
 * @param {Function} [customCloseHandler] 自定义函数来判断是否关闭停止
 * @return {Promise}
 */
export function runBySpawn(
  command: string,
  args?: string[],
  options?: SpawnOptionsWithoutStdio,
  customCloseHandler?: (data: any) => boolean,
): Promise<ChildProcessWithoutNullStreams> {
  logger.debug(`[runBySpawn] command=${command}`, command, args, options);

  return new Promise((resolve) => {
    // https://nodejs.org/dist/latest-v10.x/docs/api/child_process.html#child_process_child_process_spawn_command_args_options
    const cmd = spawn(command, args, {
      ...options,
      // windows 中如果不设置它的话会出错
      shell: true,
    });

    cmd.stdout.on('data', (data) => {
      const msg = `${data}`.trim();
      if (msg) {
        loggerCmd.stdout(msg);
      }

      // 在某些场景下不会触发 close 事件，会导致进程不退出，例如启动了 watch 的项目
      // 因此自定义一个回调，自行判断哪些场景下可以认为执行结束了
      if (typeof customCloseHandler === 'function') {
        Promise.resolve(customCloseHandler(data)).then((result) => {
          if (result) {
            logger.debug('[runBySpawn] customCloseHandler close');

            // 自行退出子进程，但是有些场景下不能调用它，例如webpack开发模式下启动 8002 端口那种场景
            // cmd.kill('SIGINT');
            resolve(cmd);
          }
        });
      }
    });

    cmd.stderr.on('data', (data) => {
      const msg = `${data}`.trim();
      if (msg) {
        loggerCmd.stderr(msg);
      }
    });

    cmd.on('close', (code) => {
      logger.debug(`[runBySpawn] child process exited with code ${code} for ${command} ${args}`);
      resolve(cmd);
    });
  });
}
/**
 * 使用 exec 来执行指定的命令
 * @param {String} command
 * @param {Object} [options]
 * @param {Function} [customCloseHandler] 自定义函数来判断是否关闭停止
 * @return {Promise}
 */
export function runByExec(
  command: string,
  options?: ExecOptions,
  customCloseHandler?: (data: any) => boolean,
): Promise<ChildProcess> {
  logger.debug('[runByExec] command', command, options);

  return new Promise((resolve) => {
    // https://nodejs.org/dist/latest-v10.x/docs/api/child_process.html#child_process_child_process_exec_command_options_callback
    const cmd = exec(command, options, () => {
      // 此回调触发时，同时也会触发 close 事件
      // 有些情况下err为null，但是存在 stderr ，也意味着出现错误
      // 因为jest每行都打印在stderr上，所以去掉对这个的判定
      // if (err || stderr) {
      //     reject(stderr);
      //     return;
      // }
      resolve(cmd);
    });

    if (cmd?.stdout && cmd?.stderr) {
      cmd.stdout.on('data', (data) => {
        const msg = `${data}`.trim();
        if (msg) {
          loggerCmd.stdout(msg);
        }

        // 在某些场景下不会触发 close 事件，会导致进程不退出，例如启动了 watch 的项目
        // 因此自定义一个回调，自行判断哪些场景下可以认为执行结束了
        if (typeof customCloseHandler === 'function') {
          Promise.resolve(customCloseHandler(data)).then((result) => {
            if (result) {
              logger.debug('[runByExec] customCloseHandler close');

              // 自行退出子进程，但是有些场景下不能调用它，例如webpack开发模式下启动 8002 端口那种场景
              // cmd.kill('SIGINT');
              resolve(cmd);
            }
          });
        }
      });

      cmd.stderr.on('data', (data) => {
        const msg = `${data}`.trim();
        if (msg) {
          loggerCmd.stderr(msg);
        }
      });
      // 当进程退出时，会触发 close 事件，同时，callback 回调也会触发，
      // 因此此处可以不必监听处理，在 callback 中处理即可
      // cmd.on('close', (code) => {
      //     console.log(`=====child process exited with code ${code}`);
      //     resolve(code);
      // });
    }
  });
}
