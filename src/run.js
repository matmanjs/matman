const fs = require('fs');
const path = require('path');

//rewrite promise, bluebird is more faster
require('babel-runtime/core-js/promise').default = require('bluebird');
global.Promise = require('bluebird');

const babelCompileDirectory = require('babel-d');

const matmanServer = require('./server');

const logger = require('./server/logger');
const matmanLogger = logger.matmanLogger();
const attentionLogger = logger.attentionLogger();

// 暴露一个全局log变量
global.matmanLogger = matmanLogger;
global.attentionLogger = attentionLogger;

module.exports = (opts) => {
  let configOpts;

  // opts 如果是字符串则认为是文件路径，可将配置项放在独立的配置文件中
  if (typeof opts === 'string' && fs.existsSync(opts)) {
    configOpts = require(opts);
  } else if (typeof opts === 'object') {
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

  // 配置数据缓存路径，默认值为 ${ROOT_PATH}/data
  // TODO 这个字段可以和 APP_PATH 进行合并，因为冗余了
  configOpts.DATA_PATH = configOpts.DATA_PATH || path.join(configOpts.ROOT_PATH, './data');

  // handler 文件相对 SRC_PATH 目录的路径，默认值为 './handler'
  configOpts.HANDLER_RELATIVE_PATH = configOpts.HANDLER_RELATIVE_PATH || './handler';

  // 日志文件存储的路径，默认值为 ${ROOT_PATH}/logs
  configOpts.LOG_PATH = configOpts.LOG_PATH || path.join(configOpts.ROOT_PATH, 'logs');

  // matman 启动之后的服务端口号，默认为 3000
  configOpts.port = configOpts.port || 3000;

  // 外部 handler 列表，比如引入npm包或者其他目录下的 handler
  configOpts.definedHandlers = configOpts.definedHandlers || [];

  // 确认 HANDLER_PATH 的值
  // if (configOpts.SRC_PATH === configOpts.APP_PATH) {
  // 如果源文件目录和运行目录一致，就不进行babel编译了
  // configOpts.HANDLER_PATH = path.join(configOpts.SRC_PATH, configOpts.HANDLER_RELATIVE_PATH);
  // } else {
  // babel 编译
  babelCompileDirectory(configOpts.SRC_PATH, configOpts.APP_PATH);
  configOpts.HANDLER_PATH = path.join(configOpts.APP_PATH, configOpts.HANDLER_RELATIVE_PATH);
  // }

  // 启动

  // 初始化日志打印
  logger.init(configOpts.LOG_PATH);
  matmanLogger.info(configOpts);

  // 创建服务，并加入 handler 路由
  const routerHandler = matmanServer.routerHandler(configOpts);
  const app = matmanServer.create();
  const middlewares = matmanServer.handlerServer();

  // Set default middlewares (logger, static, cors and no-cache)
  app.use(middlewares);

  // GET /admin，跳转到 /
  app.get('/admin', function (req, res) {
    res.redirect('/');
  });

  // GET /admin/handlers/handler/:handlerName/static/* 静态资源
  // http://localhost:3000/admin/handlers/handler/standard_cgi/static/1.png
  app.get('/admin/handlers/handler/:handlerName/static/*', (req, res) => {
    // req.params[0] = 'subdir/3.png'
    // req.params.handlerName = 'standard_cgi'
    let imageFilePath = path.join(configOpts.HANDLER_PATH, req.params.handlerName, 'static', req.params[0]);
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
  app.use((req, res, next) => {
    if (req.method === 'POST') {
      req.body.createdAt = Date.now();
    }
    // Continue to JSON Server router
    next();
  });

  // Use handler router
  app.use(routerHandler);

  // 触发 onBeforeServerListen 事件
  const server = require('./plugins/stub/websocket')(configOpts, app, routerHandler._handlerParser);

  server.listen(configOpts.port || 3000, () => {
    console.log('matman server is running');
    matmanLogger.info('matman server is running');
  });
};