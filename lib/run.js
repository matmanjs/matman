'use strict';

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fs = require('fs');
var path = require('path');

//rewrite promise, bluebird is more faster
require('babel-runtime/core-js/promise').default = require('bluebird');
global.Promise = require('bluebird');

// const babelCompileDirectory = require('babel-d');

var matmanServer = require('./server');

var logger = require('./server/logger');
var matmanLogger = logger.matmanLogger();
var attentionLogger = logger.attentionLogger();

// 暴露一个全局log变量
global.matmanLogger = matmanLogger;
global.attentionLogger = attentionLogger;

module.exports = function (opts) {
  var configOpts = void 0;

  if (typeof opts === 'string' && fs.existsSync(opts)) {
    configOpts = require(opts);
  } else if ((typeof opts === 'undefined' ? 'undefined' : (0, _typeof3.default)(opts)) === 'object') {
    configOpts = opts;
  }

  if (!configOpts || !configOpts.ROOT_PATH) {
    console.error('Params error!', opts, configOpts);
    return;
  }

  // 设置默认值
  configOpts.SRC_PATH = configOpts.SRC_PATH || path.join(configOpts.ROOT_PATH, './src');
  configOpts.APP_PATH = configOpts.APP_PATH || path.join(configOpts.ROOT_PATH, './app');
  configOpts.DATA_PATH = configOpts.DATA_PATH || path.join(configOpts.ROOT_PATH, './data');
  configOpts.HANDLER_RELATIVE_PATH = configOpts.HANDLER_RELATIVE_PATH || './handler';
  configOpts.LOG_PATH = configOpts.LOG_PATH || path.join(configOpts.ROOT_PATH, 'logs');
  configOpts.port = configOpts.port || 3000;

  // 确认 HANDLER_PATH 的值
  // if (configOpts.SRC_PATH === configOpts.APP_PATH) {
  // 如果源文件目录和运行目录一致，就不进行babel编译了
  configOpts.HANDLER_PATH = path.join(configOpts.SRC_PATH, configOpts.HANDLER_RELATIVE_PATH);
  // } else {
  //   // babel 编译
  //   babelCompileDirectory(configOpts.SRC_PATH, configOpts.APP_PATH);
  //   configOpts.HANDLER_PATH = path.join(configOpts.APP_PATH, configOpts.HANDLER_RELATIVE_PATH);
  // }

  // 初始化日志打印
  logger.init(configOpts.LOG_PATH);
  matmanLogger.info(configOpts);

  // 创建服务，并加入 handler 路由
  var routerHandler = matmanServer.routerHandler(configOpts);
  var app = matmanServer.create();
  var middlewares = matmanServer.handlerServer();

  // Set default middlewares (logger, static, cors and no-cache)
  app.use(middlewares);

  // GET /admin，跳转到 /
  app.get('/admin', function (req, res) {
    res.redirect('/');
  });

  // GET /admin/handlers/handler/:handlerName/static/* 静态资源
  // http://localhost:3000/admin/handlers/handler/standard_cgi/static/1.png
  app.get('/admin/handlers/handler/:handlerName/static/*', function (req, res) {
    // req.params[0] = 'subdir/3.png'
    // req.params.handlerName = 'standard_cgi'
    var imageFilePath = path.join(configOpts.HANDLER_PATH, req.params.handlerName, 'static', req.params[0]);
    res.sendfile(imageFilePath);
  });

  // GET /admin/*
  app.get('/admin/*', function (req, res) {
    // res.jsonp({ url2: req.url });
    res.sendFile(path.join(__dirname, '../www/static', 'index.html'));
  });

  app.use(logger.connectLogger());

  // To handle POST, PUT and PATCH you need to use a body-parser
  // You can use the one used by JSON Server
  app.use(matmanServer.bodyParser);
  app.use(function (req, res, next) {
    if (req.method === 'POST') {
      req.body.createdAt = Date.now();
    }
    // Continue to JSON Server router
    next();
  });

  // Use handler router
  app.use(routerHandler);

  // 触发 onBeforeServerListen 事件
  var server = require('./plugins/stub/websocket')(configOpts, app, routerHandler._handlerParser);

  server.listen(configOpts.port || 3000, function () {
    console.log('matman server is running');
    matmanLogger.info('matman server is running');
  });
};
//# sourceMappingURL=run.js.map