const fs = require('fs');
const path = require('path');

const matmanServer = require('./server');

const logger = require('./server/logger');
const matmanLog = logger.matmanLog();

module.exports = (entryPath) => {
  // 校验 entryPath 文件是否存在
  if (!fs.existsSync(entryPath)) {
    console.error(entryPath + ' is not exist!');
    return;
  }

  const routerMocker = matmanServer.routerMocker(entryPath);
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

  server.use(logger.connectLogger(entryPath));

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

  server.listen(3000, () => {
    console.log('matman server is running');
    matmanLog.info('matman server is running');
  });
};