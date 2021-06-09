import { exec } from 'child_process';

/**
 * 检查 whistle 是否已经启动，若是已经启动，则返回端口号
 *
 * @return {Promise<string | number>}
 */
export function checkIfWhistleStarted(): Promise<string | number> {
  return new Promise((resolve, reject) => {
    exec('w2 status', (error, stdout) => {
      if (error) {
        return reject(error);
      }

      const matchResult = stdout.match(/127\.0\.0\.1:([0-9]+)\//i);
      if (matchResult?.[1]) {
        resolve(matchResult[1]);
      } else {
        reject(stdout);
      }
    });
  });
}

/**
 * 直接启动 whistle，启动成功则返回端口号
 *
 * @return {Promise<string | number>}
 */
export function startWhistleDirect(): Promise<string | number> {
  return new Promise((resolve, reject) => {
    exec('w2 start', (error, stdout) => {
      if (error) {
        return reject(error);
      }

      const matchResult = stdout.match(/127\.0\.0\.1:([0-9]+)\//i);
      if (matchResult?.[1]) {
        resolve(matchResult[1]);
      } else {
        reject(stdout);
      }
    });
  });
}

/**
 * 获得本地 whistle 地址
 *
 * @param {Number} port 指定端口
 * @param {Boolean} shouldUseStartedPort 是否优先使用已经启动的 whistle 端口
 * @return {Promise<string>}
 */
export async function getLocalWhistleServer(
  port?: number,
  shouldUseStartedPort?: boolean,
): Promise<string> {
  // process.env.WHISTLE_PORT 该值拥有最高优先级，主要用于自动化测试场景
  if (process.env.WHISTLE_PORT) {
    return `127.0.0.1:${process.env.WHISTLE_PORT}`;
  }

  let whistlePort;

  // 如果需要优先使用已经启动的 whistle 端口，则需要去检查下
  if (shouldUseStartedPort) {
    try {
      whistlePort = await checkIfWhistleStarted();
    } catch (e) {
      if (process.env.IS_DEV === '1') {
        console.log('checkIfWhistleStarted() catch', e);
      }
    }
  }

  if (!whistlePort) {
    // whistle 默认的端口号为 8899
    whistlePort = port || 8899;
  }

  return `127.0.0.1:${whistlePort}`;
}
