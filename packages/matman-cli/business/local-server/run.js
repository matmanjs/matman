const fs = require('fs');
const path = require('path');

//rewrite promise, bluebird is more faster
// require('babel-runtime/core-js/promise').default = require('bluebird');
global.Promise = require('bluebird');

// const babelCompileDirectory = require('babel-d');

const matmanServer = require('./server');

const logger = require('./server/logger');
const matmanLogger = logger.matmanLogger();
const attentionLogger = logger.attentionLogger();

// 暴露一个全局log变量
global.matmanLogger = matmanLogger;
global.attentionLogger = attentionLogger;

module.exports = (configOpts) => {
  //====================================================================================
  // 1. 获取配置项
  // 如果没法获取配置项，则将无法启动成功
  if (!configOpts) {
    throw new Error('Invalid param!');
  }

  //====================================================================================
  // 2. babel 编译等预处理
  //====================================================================================
  // babelCompileDirectory(configOpts.SRC_PATH, configOpts.APP_PATH);

  //====================================================================================
  // 3. 初始化日志打印
  //====================================================================================
  logger.init(configOpts.logPath);
  matmanLogger.info(configOpts);
  // console.log('configOpts:', configOpts);

  //====================================================================================
  // 4. 创建服务，并加入 handler 路由
  //====================================================================================
  const routerMocker = matmanServer.router(configOpts);
  const app = matmanServer.create();
  const middlewares = matmanServer.middleware();

  // Set default middlewares (logger, static, cors and no-cache)
  app.use(middlewares);

  //====================================================================================
  // 5. matman 管理系统中使用的路由配置
  //====================================================================================
  // GET /，跳转到 /matman-admin/
  app.get('/', function (req, res) {
    res.redirect('/matman-admin/');
  });

  app.get('/mytest', function (req, res) {
    res.send('hello,world!');
  });

  // 静态资源的配置
  // TODO 此处还需要支持 reporter 等场景
  // GET /matman-admin/mockers/:name/static/* 静态资源
  // http://localhost:9527/matman-admin/mockers/demo_03/static/sub/workflow.png
  app.get('/matman-admin/mockers/:name/static/*', (req, res) => {
    // req.params[0] = 'sub/workflow.png'
    // req.params.name = 'demo_03'

    let mockerName = req.params.name;
    let mockerItem = routerMocker._mockerParser.getMockerByName(mockerName);
    let staticRelativePath = path.join('static', req.params[0]);

    if (!mockerItem) {
      res.send(`Can not find ${path.join(mockerName, staticRelativePath)}`);
    } else {
      res.sendFile(path.join(mockerItem.basePath, staticRelativePath));
    }
  });

  // 单页应用，因此只要是 /matman-admin/* 的都加载静态html页面
  // GET /matman-admin/*
  app.get('/matman-admin/*', function (req, res) {
    // res.jsonp({ url2: req.url });
    res.sendFile(path.join(__dirname, './webui/build', 'index.html'));
  });

  // 日志打印模块
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
  app.use(routerMocker);

  // https://socket.io/get-started/chat/#The-web-framework
  const server = require('http').createServer(app);

  // TODO 触发 onBeforeServerListen 事件
  // 如果启动了 plugin=async 则开启 websocket
  if (configOpts.supportAsync) {
    require('./plugins/mocker/websocket')(configOpts, server, routerMocker._mockerParser);
  }

  server.listen(configOpts.port || 9527, () => {
    // matmanLogger.info('matman server is running');
    console.log('matman server is running');

    if (configOpts.shouldWatch) {
      // matmanLogger.info('watching files...');
      console.log('watching files...');

      // TODO 文件变化了，需要重启！
    }
  });
};