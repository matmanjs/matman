import net from 'net';
import { runByExec } from './run-cmd';
import { createLogger } from './logger';

const logger = createLogger('port');

interface IServerError extends Error {
  code: string;
}

/**
 * 检查某个端口是否被占用
 *
 * @param {Number} port 端口号，取值为 >= 0 and < 65536
 * @param {Function} [callback] 回调，接受两个参数，isSuccess 和 err
 * @author linjianghe
 */
export function portIsOccupied(
  port: number,
  callback: (isSuccess: boolean, err?: IServerError) => void,
): void {
  // 创建服务并监听该端口
  const server = net.createServer().listen(port);

  server.on('listening', () => {
    // 执行这块代码说明端口未被占用
    // 关闭服务
    server.close();
    // 控制台输出信息
    // console.log('The port【' + port + '】 is available.');
    if (typeof callback === 'function') {
      callback(true);
    }
  });

  server.on('error', (err: IServerError) => {
    if (err.code === 'EADDRINUSE') {
      // 端口已经被使用
      logger.debug(`The port【 ${port} 】 is occupied, please change other port.`);
    }
    if (typeof callback === 'function') {
      callback(false, err);
    }
  });
}

/**
 * 找到当前未被占用的端口号
 *
 * @param {Number} [port] 查找的起始端口号
 * @param {Array} [skipList] 需要忽略的端口号
 * @return {Promise}
 * @author linjianghe
 */
export function findAvailablePort(
  port = 9528,
  skipList: (number | string)[] = [],
): Promise<number> {
  return new Promise((resolve, reject) => {
    let targetPort = port;

    const check = () => {
      // 过滤掉目标端口
      while (skipList.indexOf(targetPort) > -1) {
        targetPort = targetPort + 1;
      }

      portIsOccupied(targetPort, (isFound) => {
        if (isFound) {
          resolve(targetPort);
        } else {
          targetPort = targetPort + 1;
          if (targetPort > 65535) {
            reject(new Error('can not find available port'));
          } else {
            check();
          }
        }
      });
    };

    check();
  });
}

/**
 * 杀掉指定端口的进程
 *
 * @param {Number|Array} port 端口号
 * @return {Promise}
 * @author linjianghe
 */
export async function killPort(port: number | number[]): Promise<void> {
  logger.info(`killPort: ${port}`);

  const killOnePort = (port: number) => new Promise((resolve, reject) => {
    logger.info(`killOnePort: ${port}`);

    // const command = `ps -ef | grep "node" | grep ${port} | grep -v grep | awk '{print $2}' | xargs kill -9`;
    const command = `lsof -i:${port} | grep ${port}  | grep -v grep | awk '{print $2}' | xargs kill -9`;

    runByExec(command)
      .then(() => {
        logger.info(`kill port=${port} success!`);
        resolve(command);
      })
      .catch((err) => {
        logger.error(`kill port=${port} fail!`, err);
        reject(err);
      });
  });

  const portList = Array.isArray(port) ? port : [port];

  for (const item of portList) {
    try {
      await killOnePort(item);
    } catch (e) {
      logger.error(`killOnePort port=${item} fail!`);
    }
  }
}
