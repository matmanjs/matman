const express = require('express');
const methodOverride = require('method-override');
const _ = require('lodash');
const request = require('request');
const bodyParser = require('../body-parser');
const business = require('../business');

module.exports = (entryPath) => {
  const entry = require(entryPath);

  let mockerList = business.getMockerList(entry.MOCKER_PATH);

  // Create router
  // http://expressjs.com/en/4x/api.html#router
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
    mockerList = business.getMockerList(entry.MOCKER_PATH);

    res.jsonp(mockerList);
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

  // 根据用户配置的路由关系，进行解析
  // console.log('mockerList', mockerList);
  mockerList.forEach((mockerData) => {
    //TODO cgi 可能不是以 / 开头的，建议以 route 形式会更好

    // 默认是 get 请求，除非定义 method 字段
    const METHOD = (mockerData.method || 'get').toLowerCase();
    const ROUTE_PATH = mockerData.route;

    // http://expressjs.com/en/4x/api.html#router.METHOD
    router[METHOD](ROUTE_PATH, function (req, res) {
      // Express的req对象，详见 http://expressjs.com/en/4x/api.html#req

      // post 请求
      // mockerData.cgi="/cgi-bin/a/b/post_cgi"
      // post http://localhost:3000/cgi-bin/a/b/post_cgi data={activeModule:"error_not_login"}
      // req.baseUrl=""
      // req.originalUrl="/cgi-bin/a/b/post_cgi"
      // req.url="/cgi-bin/a/b/post_cgi"
      // req.method="POST"
      // req.OriginalMethod="POST"
      // req.body.activeModule = "error_not_login"
      // req.body = data

      // get 请求
      // mockerData.cgi="/cgi-bin/a/b/simple_cgi"
      // get http://localhost:3000/cgi-bin/a/b/simple_cgi?activeModule=error_not_login
      // req.baseUrl=""
      // req.originalUrl="/cgi-bin/a/b/simple_cgi?activeModule=error_not_login"
      // req.url="/cgi-bin/a/b/simple_cgi?activeModule=error_not_login"
      // req.method="GET"
      // req.OriginalMethod="GET"
      // req.query.activeModule = "error_not_login"

      let mockerBasePath = entry.MOCKER_PATH;
      // let url = req.params[0];
      let url = ROUTE_PATH;
      let params = (METHOD === 'post') ? req.body : req.query;

      console.log('router METHOD 3', METHOD, mockerData.route, url, params)

      business.getMockModule(mockerBasePath, url, params)
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
        });
    });
  });

  // GET /*
  // router.get('/*', function (req, res) {
  //   // Express的req对象，详见 http://expressjs.com/en/4x/api.html#req
  //   // 例如：/test/two/?t=1，
  //   // req.query.t=1
  //   // req.params[0]="test/two"
  //
  //   let mockerBasePath = entry.MOCKER_PATH
  //   let url = req.params[0];
  //   let params = req.query;
  //
  //   business.getMockModule(mockerBasePath, url, params)
  //     .then((result) => {
  //       // res.jsonp({
  //       //   url: req.url,
  //       //   params: req.params,
  //       //   query: req.query,
  //       //   data: result
  //       // });
  //       res.jsonp(result);
  //     })
  //     .catch((err) => {
  //       // 注意 err 有可能是 Error 对象，也可能是普通的字符串或对象
  //       let errMsg = err.stack || err;
  //
  //       console.error(errMsg);
  //       // 如果是未知的CGI，则透传结果即可
  //       if (errMsg === 'UNKNOWN_CGI') {
  //         // Load remote data
  //         const opts = {
  //           url: 'http://' + req.headers.host + req.url,
  //           json: true
  //         };
  //
  //         request(opts, (err, response) => {
  //           if (err) {
  //             res.status(500).send(err);
  //           } else {
  //             res.jsonp(response.body);
  //           }
  //         })
  //       } else {
  //         res.status(500).send(errMsg);
  //       }
  //
  //     });
  // });

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
