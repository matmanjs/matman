'use strict';

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fs = require('fs');
var path = require('path');

var matmanServer = require('./server');

var logger = require('./server/logger');
var matmanLog = logger.matmanLog();

module.exports = function (opts) {
  var configOpts = void 0;

  if (typeof opts === 'string' && fs.existsSync(opts)) {
    configOpts = require(opts);
  } else if ((typeof opts === 'undefined' ? 'undefined' : (0, _typeof3.default)(opts)) === 'object') {
    configOpts = opts;
  }

  console.log(configOpts);

  if (!configOpts || !configOpts.ROOT_PATH || !configOpts.MOCKER_PATH) {
    console.error('Params error!', opts);
    return;
  }

  var routerMocker = matmanServer.routerMocker(configOpts);
  var server = matmanServer.create();
  var middlewares = matmanServer.mockServer();

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
  server.use(function (req, res, next) {
    if (req.method === 'POST') {
      req.body.createdAt = Date.now();
    }
    // Continue to JSON Server router
    next();
  });

  // Use default router
  server.use(routerMocker);

  server.listen(configOpts.port || 3000, function () {
    console.log('matman server is running');
    matmanLog.info('matman server is running');
  });
};
//# sourceMappingURL=run.js.map