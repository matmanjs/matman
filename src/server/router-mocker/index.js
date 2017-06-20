const express = require('express');
const methodOverride = require('method-override');
const _ = require('lodash');
const bodyParser = require('../body-parser');
const business = require('../business');

module.exports = (entryPath) => {
  const entry = require(entryPath);

  // Create router
  const router = express.Router();

  // Add middlewares
  router.use(methodOverride());
  router.use(bodyParser);

  // Expose render
  router.render = (req, res) => {
    res.jsonp(res.locals.data)
  };

  // GET /sys-cgi/mocker 所有的 mocker 列表信息
  router.get('/sys-cgi/mocker', (req, res) => {
    let result = business.getMockerList(entry.MOCKER_PATH);

    res.jsonp(result);
  });

  // GET /sys-cgi/mocker/:mockerName 获得这个 mocker 的信息
  router.get('/sys-cgi/mocker/:mockerName', (req, res) => {
    let result = business.getMocker(entry.MOCKER_PATH, req.params.mockerName);

    res.jsonp(result);
  });

  // POST /sys-cgi/mocker/:mockerName 设置这个mocker的信息
  router.post('/sys-cgi/mocker/:mockerName', (req, res) => {
    let result = business.setActiveModule(entry.MOCKER_PATH, req.params.mockerName, req.body.activeModule);

    res.jsonp(result);
  });

  // GET /*
  router.get('/*', function (req, res) {
    business.getMockModuleResult(req, entry)
      .then((result) => {
        // res.jsonp({
        //   url: req.url,
        //   params: req.params,
        //   query: req.query,
        //   data: result
        // });
        res.jsonp(result);
      })
      .catch((err) => {
        // 注意 err 有可能是 Error 对象，也可能是普通的字符串或对象
        let errMsg = err.stack || err;

        console.error(errMsg);

        res.status(500).send(errMsg);
      });
  });

  router.use((req, res) => {
    if (!res.locals.data) {
      res.status(404);
      res.locals.data = {};
    }

    router.render(req, res);
  });

  router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send(err.stack);
  });

  return router;
};
