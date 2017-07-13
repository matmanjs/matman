const path = require('path');
const log4js = require('log4js');

exports.init = function (logPath) {
  let isAbsolute = logPath && path.isAbsolute(logPath);

  log4js.configure({
    appenders: [
      { type: 'console' }, //控制台输出
      {
        type: 'file', //文件输出
        filename: isAbsolute ? path.join(logPath, 'access.log') : 'logs/access.log',
        maxLogSize: 1024 * 1024 * 50, // 50MB
        // backups: 1,
        category: 'http',
        absolute: isAbsolute
      },
      {
        type: 'file', //文件输出
        filename: isAbsolute ? path.join(logPath, 'matman.log') : 'logs/matman.log',
        maxLogSize: 1024 * 1024 * 50, // 50MB
        // backups: 1,
        category: 'matman',
        absolute: isAbsolute
      }
    ],
    replaceConsole: true
  });
};

exports.connectLogger = function () {
  // return log4js.connectLogger(this.logger('http'), { level: 'auto', format: ':method :url' });
  // https://github.com/nomiddlename/log4js-example/blob/master/app.js
  return log4js.connectLogger(this.logger('http'), { level: 'auto' });
};

exports.logger = function (name) {
  const logger = log4js.getLogger(name);

  logger.setLevel('INFO');

  return logger;
};

exports.matmanLog = function () {
  return this.logger('matman');
};
