import { exec } from 'child_process';

/**
 * 检查 whistle 是否已经启动，若是已经启动，则返回端口号
 *
 * @return {Promise<string | number>}
 */
export function checkIfWhistleStarted(): Promise<string | number> {
  return new Promise((resolve, reject) => {
    exec('w2 status', (error, stdout, stderr) => {
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
    exec('w2 start', (error, stdout, stderr) => {
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
