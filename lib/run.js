'use strict';

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fs = require('fs');
var path = require('path');

//rewrite promise, bluebird is more faster
require('babel-runtime/core-js/promise').default = require('bluebird');
global.Promise = require('bluebird');

var babelCompileDirectory = require('babel-d');

var matmanServer = require('./server');
var util = require('./util');

var logger = require('./server/logger');
var matmanLogger = logger.matmanLogger();
var attentionLogger = logger.attentionLogger();

// 暴露一个全局log变量
global.matmanLogger = matmanLogger;
global.attentionLogger = attentionLogger;

module.exports = function (opts) {
  var configOpts = void 0;

  // opts 如果是字符串则认为是文件路径，可将配置项放在独立的配置文件中
  if (typeof opts === 'string' && fs.existsSync(opts)) {
    configOpts = require(opts);
  } else if ((typeof opts === 'undefined' ? 'undefined' : (0, _typeof3.default)(opts)) === 'object') {
    configOpts = opts;
  }

  // 如果没有 ROOT_PATH，则将无法启动成功
  if (!configOpts || !configOpts.ROOT_PATH) {
    console.error('Invalid param!', opts, configOpts);
    return;
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
  configOpts.shouldWatch = configOpts.shouldWatch || process.env.NODE_ENV === 'development' || false;

  // babel 编译
  babelCompileDirectory(configOpts.SRC_PATH, configOpts.APP_PATH);

  // 启动

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

  // TODO 此处还需要支持 reporter 等场景
  // GET /admin/mockers/mocker/:name/static/* 静态资源
  // http://localhost:3000/admin/mockers/mocker/standard_cgi/static/subdir/3.png
  app.get('/admin/mockers/mocker/:name/static/*', function (req, res) {
    // req.params[0] = 'subdir/3.png'
    // req.params.name = 'standard_cgi'

    var handlerName = req.params.name;
    var curDefinedHandler = routerHandler._handlerParser.getDefinedHandler(handlerName);
    var staticRelativePath = path.join('static', req.params[0]);

    if (!curDefinedHandler) {
      res.send('Can not find ' + path.join(handlerName, staticRelativePath));
    } else {
      res.sendFile(path.join(curDefinedHandler.PATH, staticRelativePath));
    }
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

    if (configOpts.shouldWatch) {
      matmanLogger.info('watching files...');

      util.watch([], [configOpts.SRC_PATH], [], {}, function (err, filesModified, dirsModified, missingCreated, fileTimestamps, dirTimestamps) {
        console.log('文件变化了，需要重启！');
        process.exit(1);
      });
    }
  });
};
//# sourceMappingURL=run.js.map