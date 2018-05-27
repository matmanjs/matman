'use strict';

var fs = require('fs');
var path = require('path');

//rewrite promise, bluebird is more faster
// require('babel-runtime/core-js/promise').default = require('bluebird');
global.Promise = require('bluebird');

var babelCompileDirectory = require('babel-d');

var matmanServer = require('./server');
var util = require('./util');
var runConfig = require('./business/run-config');

var logger = require('./server/logger');
var matmanLogger = logger.matmanLogger();
var attentionLogger = logger.attentionLogger();

// 暴露一个全局log变量
global.matmanLogger = matmanLogger;
global.attentionLogger = attentionLogger;

module.exports = function (opts) {
  //====================================================================================
  // 1. 获取配置项
  //====================================================================================
  var configOpts = runConfig.getConfigOpts(opts);

  // 如果没法获取配置项，则将无法启动成功
  if (!configOpts) {
    throw new Error('Invalid param!');
  }

  //====================================================================================
  // 2. babel 编译等预处理
  //====================================================================================
  babelCompileDirectory(configOpts.SRC_PATH, configOpts.APP_PATH);

  //====================================================================================
  // 3. 初始化日志打印
  //====================================================================================
  logger.init(configOpts.LOG_PATH);
  matmanLogger.info(configOpts);

  //====================================================================================
  // 4. 创建服务，并加入 handler 路由
  //====================================================================================
  var routerHandler = matmanServer.routerHandler(configOpts);
  var app = matmanServer.create();
  var middlewares = matmanServer.handlerServer();

  // Set default middlewares (logger, static, cors and no-cache)
  app.use(middlewares);

  //====================================================================================
  // 5. matman 管理系统中使用的路由配置
  //====================================================================================
  // GET /admin，跳转到 /
  app.get('/admin', function (req, res) {
    res.redirect('/');
  });

  // 静态资源的配置
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

  // 单页应用，因此只要是 /admin/* 的都加载静态html页面
  // GET /admin/*
  app.get('/admin/*', function (req, res) {
    // res.jsonp({ url2: req.url });
    res.sendFile(path.join(__dirname, '../www/static', 'index.html'));
  });

  // 日志打印模块
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