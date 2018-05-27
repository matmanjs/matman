const fs = require('fs');
const path = require('path');

/**
 * 获取最终的配置数据
 * @param {Object | String} opts 用户传递过来的参数
 * @returns {Object}
 */
function getConfigOpts(opts) {
  let configOpts;

  try {
    // opts 如果是字符串则认为是文件路径，可将配置项放在独立的配置文件中
    if (typeof opts === 'string' && fs.existsSync(opts)) {
      configOpts = require(opts);
    } else if (opts && (typeof opts === 'object')) {
      configOpts = opts;
    } else {
      configOpts = null;
    }
  } catch (e) {
    console.error('getConfigOpts catch e:', e);
  }

  // 必须要存在配置
  if (!configOpts) {
    console.error('Invalid param!', opts);
    return null;
  }

  // 如果没有 ROOT_PATH，则将无法启动成功
  if (!configOpts.ROOT_PATH) {
    console.error('Should define ROOT_PATH!', opts, configOpts);
    return null;
  }

  // 设置默认值
  // 项目源文件的目录，默认值为 ${ROOT_PATH}/src
  configOpts.SRC_PATH = configOpts.SRC_PATH || path.join(configOpts.ROOT_PATH, './src');

  // 运行目录，由 SRC_PATH 处理之后生成的，默认值为 ${ROOT_PATH}/app
  configOpts.APP_PATH = configOpts.APP_PATH || path.join(configOpts.ROOT_PATH, './app');

  // 配置数据缓存路径，默认值为 APP_PATH
  configOpts.DATA_PATH = configOpts.DATA_PATH || configOpts.APP_PATH;

  // handler 文件相对 SRC_PATH 目录的路径，默认值为 './handlers'
  configOpts.HANDLERS_RELATIVE_PATH = configOpts.HANDLERS_RELATIVE_PATH || './handlers';

  // 日志文件存储的路径，默认值为 ${ROOT_PATH}/logs
  configOpts.LOG_PATH = configOpts.LOG_PATH || path.join(configOpts.ROOT_PATH, 'logs');

  // matman 启动之后的服务端口号，默认为 3000
  configOpts.port = configOpts.port || 3000;

  // 外部 handler 列表，比如引入npm包或者其他目录下的 handler
  configOpts.definedHandlers = configOpts.definedHandlers || [];

  // 确认 HANDLERS_PATH 的值
  configOpts.HANDLERS_PATH = path.join(configOpts.APP_PATH, configOpts.HANDLERS_RELATIVE_PATH);

  // 是否 watch 文件变动
  configOpts.shouldWatch = configOpts.shouldWatch || (process.env.NODE_ENV === 'development') || false;

  return configOpts;
}

module.exports = {
  getConfigOpts: getConfigOpts
};