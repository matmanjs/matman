import createLogger from 'redux-logger';

/**
 * 默认的 logger 方法
 * @param store
 */
let logger = store => next => action => {
  return next(action);
};

// 具体配置详见: https://github.com/evgenyrodionov/redux-logger#options
logger = createLogger({
  // ...options
});

export default logger;

