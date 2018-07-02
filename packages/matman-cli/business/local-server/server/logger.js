const path = require('path');
const log4js = require('log4js');

exports.init = function (logPath) {
  logPath = logPath || './build/logs';

  log4js.configure({
    appenders: {
      console: {
        type: 'console'
      },
      http: {
        type: 'file',
        filename: path.join(logPath, 'access.log'),
        maxLogSize: 1024 * 1024 * 50 // 50MB
      },
      matman: {
        type: 'file',
        filename: path.join(logPath, 'matman.log'),
        maxLogSize: 1024 * 1024 * 50 // 50MB
      },
      attention: {
        type: 'file',
        filename: path.join(logPath, 'attention.log'),
        maxLogSize: 1024 * 1024 * 50 // 50MB
      }
    },
    categories: {
      default: { appenders: ['console'], level: 'info' },
      http: { appenders: ['console', 'http'], level: 'trace' },
      matman: { appenders: ['console', 'matman'], level: 'trace' },
      attention: { appenders: ['console', 'attention'], level: 'trace' }
    }
  });
};

exports.connectLogger = function () {
  // return log4js.connectLogger(this.logger('http'), { level: 'auto', format: ':method :url' });
  // https://github.com/nomiddlename/log4js-example/blob/master/app.js
  return log4js.connectLogger(this.logger('http'), { level: 'auto' });
};

exports.logger = function (name) {
  const logger = log4js.getLogger(name);

  // logger.setLevel('INFO');

  return logger;
};

exports.matmanLogger = function () {
  return this.logger('matman');
};

exports.attentionLogger = function () {
  return this.logger('attention');
};
