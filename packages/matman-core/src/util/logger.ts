import debug from 'debug';

interface ICreateLoggerReturn {
  debug: debug.Debugger;
  info: debug.Debugger;
  error: debug.Debugger;
}

export const LOG_TAG_NAME = process.env.LOG_TAG_NAME || 'matman';

const LOG_LEVEL = {
  ERROR: 'error',
  INFO: 'info',
  DEBUG: 'debug',
};

const LOG_NAMESPACE = {
  ERROR: [`${LOG_TAG_NAME}:error*`],
  INFO: [`${LOG_TAG_NAME}:info*`],
  DEBUG: [`${LOG_TAG_NAME}:debug*`],
  CMD: [`${LOG_TAG_NAME}:stdout`, `${LOG_TAG_NAME}:stderr`],
};

export const createDebug = debug;

export function createLogger(namespace?: string): ICreateLoggerReturn {
  const extra = namespace ? `:${namespace}` : '';

  return {
    // 这个级别最低的东东，一般的来说，在系统实际运行过程中，一般都是不输出的。
    // 因此这个级别的信息，可以随意的使用，任何觉得有利于在调试时更详细的了解系统运行状态的东东，比如变量的值等等，都输出来看看也无妨。
    debug: debug(`${LOG_TAG_NAME}:debug${extra}`),
    // 这个应该用来反馈系统的当前状态给最终用户的，所以，在这里输出的信息，应该对最终用户具有实际意义，也就是最终用户要能够看得明白是什么意思才行。
    // 从某种角度上说，Info 输出的信息可以看作是软件产品的一部分（就像那些交互界面上的文字一样），所以需要谨慎对待，不可随便。
    info: debug(`${LOG_TAG_NAME}:info${extra}`),
    error: debug(`${LOG_TAG_NAME}:error${extra}`),
  };
}

function getDebugEnableConfig(logLevel: string) {
  let result: string[] = [];

  switch (logLevel) {
    case LOG_LEVEL.ERROR:
      result = result.concat(LOG_NAMESPACE.ERROR, LOG_NAMESPACE.CMD);
      break;
    case LOG_LEVEL.DEBUG:
      result = result.concat(
        LOG_NAMESPACE.ERROR,
        LOG_NAMESPACE.INFO,
        LOG_NAMESPACE.DEBUG,
        LOG_NAMESPACE.CMD,
      );
      break;
    default:
      result = result.concat(LOG_NAMESPACE.ERROR, LOG_NAMESPACE.INFO, LOG_NAMESPACE.CMD);
      break;
  }

  return result.join(',');
}

debug.enable(getDebugEnableConfig(process.env.LOG_LEVEL || LOG_LEVEL.INFO));

export const logger =  createLogger();
