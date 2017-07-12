const fs = require('fs');
const path = require('path');

//rewrite promise, bluebird is more faster
require('babel-runtime/core-js/promise').default = require('bluebird');
global.Promise = require('bluebird');

const babelCompileDirectory = require('babel-d');

const matmanServer = require('./server');

const logger = require('./server/logger');
const matmanLog = logger.matmanLog();

module.exports = (opts) => {
  let configOpts;

  if (typeof opts === 'string' && fs.existsSync(opts)) {
    configOpts = require(opts);
  } else if (typeof opts === 'object') {
    configOpts = opts;
  }

  console.log(configOpts)

  if (!configOpts || !configOpts.ROOT_PATH) {
    console.error('Params error!', opts, configOpts);
    return;
  }

  // 设置默认值
  configOpts.SRC_PATH = configOpts.SRC_PATH || path.join(configOpts.ROOT_PATH, './src');
  configOpts.APP_PATH = configOpts.APP_PATH || path.join(configOpts.ROOT_PATH, './lib');
  configOpts.MOCKER_RELATIVE_PATH = configOpts.MOCKER_RELATIVE_PATH || './mocker';
  configOpts.LOG_PATH = configOpts.LOG_PATH || path.join(configOpts.ROOT_PATH, 'logs');
  configOpts.port = configOpts.port || 3000;

  // 确认 MOCKER_PATH 的值
  if (configOpts.SRC_PATH === configOpts.APP_PATH) {
    // 如果源文件目录和运行目录一致，就不进行babel编译了
    configOpts.MOCKER_PATH = path.join(configOpts.SRC_PATH, configOpts.MOCKER_RELATIVE_PATH);
  } else {
    // babel 编译
    babelCompileDirectory(configOpts.SRC_PATH, configOpts.APP_PATH);
    configOpts.MOCKER_PATH = path.join(configOpts.APP_PATH, configOpts.MOCKER_RELATIVE_PATH);
  }

  const routerMocker = matmanServer.routerMocker(configOpts);
  const server = matmanServer.create();
  const middlewares = matmanServer.mockServer();

  // Set default middlewares (logger, static, cors and no-cache)
  server.use(middlewares);

  // GET /admin，跳转到 /
  server.get('/admin', function (req, res) {
    res.redirect('/');
  });

  // GET /admin/*
  server.get('/admin/*', function (req, res) {
    // res.jsonp({ url2: req.url });
    res.sendFile(path.join(__dirname, '../www/static', 'index.html'));
  });

  server.use(logger.connectLogger(configOpts));

  // To handle POST, PUT and PATCH you need to use a body-parser
  // You can use the one used by JSON Server
  server.use(matmanServer.bodyParser);
  server.use((req, res, next) => {
    if (req.method === 'POST') {
      req.body.createdAt = Date.now()
    }
    // Continue to JSON Server router
    next();
  });

  // Use default router
  server.use(routerMocker);

  server.listen(configOpts.port || 3000, () => {
    console.log('matman server is running');
    matmanLog.info('matman server is running');
  });
};