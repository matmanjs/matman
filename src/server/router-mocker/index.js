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

  // GET /sys-cgi/mocker/:mockerName/readme 获得这个 mocker 的readme信息
  router.get('/sys-cgi/mocker/:mockerName/readme', (req, res) => {
    // res.send(business.getMockerReadme(entry.MOCKER_PATH, req.params.mockerName));
    // res.send(business.getMockerReadme(entry.MOCKER_PATH, req.params.mockerName));
    res.jsonp({
      html: business.getMockerReadme(entry.MOCKER_PATH, req.params.mockerName)
    });
  });

  // POST /sys-cgi/mocker/:mockerName 设置这个mocker的信息
  router.post('/sys-cgi/mocker/:mockerName', (req, res) => {
    let result = business.updateMocker(entry.MOCKER_PATH, req.params.mockerName, req.body);

    res.jsonp(result);
  });

  // 所有的请求都会经过这里，可以做一些类似权限控制的事情
  router.all('*', function (req, res, next) {
    next();
  });

  // 根据用户配置的路由关系，进行解析
  // console.log('mockerList', mockerList);
  mockerList.forEach((mockerData) => {
    // 默认是 get 请求，除非定义 method 字段
    const METHOD = (mockerData.method || 'get').toLowerCase();
    const ROUTE_PATH = mockerData.route;

    // http://expressjs.com/en/4x/api.html#router.METHOD
    router[METHOD](ROUTE_PATH, function (req, res, next) {
      // Express的req对象，详见 http://expressjs.com/en/4x/api.html#req

      // post 请求
      // mockerData.route="/cgi-bin/a/b/post_cgi"
      // post http://localhost:3000/cgi-bin/a/b/post_cgi data={activeModule:"error_not_login"}
      // req.baseUrl=""
      // req.originalUrl="/cgi-bin/a/b/post_cgi"
      // req.url="/cgi-bin/a/b/post_cgi"
      // req.method="POST"
      // req.OriginalMethod="POST"
      // req.body.activeModule = "error_not_login"
      // req.body = data

      // get 请求
      // mockerData.route="/cgi-bin/a/b/simple_cgi"
      // get http://localhost:3000/cgi-bin/a/b/simple_cgi?activeModule=error_not_login
      // req.baseUrl=""
      // req.originalUrl="/cgi-bin/a/b/simple_cgi?activeModule=error_not_login"
      // req.url="/cgi-bin/a/b/simple_cgi?activeModule=error_not_login"
      // req.method="GET"
      // req.OriginalMethod="GET"
      // req.query.activeModule = "error_not_login"

      // get 请求且route为匹配类型
      // mockerData.route="/cgi-bin/a/b/id/:id"
      // get http://localhost:3000/cgi-bin/a/b/id/1?activeModule=error_not_login
      // req.baseUrl=""
      // req.originalUrl="/cgi-bin/a/b/id/1?activeModule=error_not_login"
      // req.url="/cgi-bin/a/b/id/1?activeModule=error_not_login"
      // req.method="GET"
      // req.OriginalMethod="GET"
      // req.query.activeModule = "error_not_login"
      // req.params.id = "1"

      let mockerBasePath = entry.MOCKER_PATH;

      // 从请求 req 或者 config.json 文件中检查当前请求是否需要禁用 mock 服务
      let isDisable = req.query._m_disable || req.body._m_disable;
      if (!isDisable) {
        // 此处要重新获取新的数据，以便取到缓存的。
        // TODO 此处还可以优化，比如及时更新缓存中的数据，而不需要每次都去获取
        let curMockerData = business.getMocker(mockerBasePath, mockerData.name);

        isDisable = curMockerData.disable;
      }

      if (isDisable) {
        // 如果当前禁用了 mock 服务，则不处理
        res.locals.isDisabled = true;
        res.locals.mockerName = mockerData.name;
        next();
      } else {
        let url = ROUTE_PATH;
        let params = (METHOD === 'post') ? req.body : req.query;

        // 还要合并一下来自 url path 中的参数值
        params = _.merge({}, params, req.params);

        // 请求
        business.getMockModule(mockerBasePath, url, params, req)
          .then((result) => {
            res.append('matman-mocker', result.mockerDBState.name);
            res.append('matman-mock-module', result.mockModuleName);
            res.jsonp(result.data);
          })
          .catch((err) => {
            // 注意 err 有可能是 Error 对象，也可能是普通的字符串或对象
            let errMsg = err.stack || err;

            console.error(errMsg);

            res.status(500).send(errMsg);
          });
      }

    });
  });

  router.use((req, res) => {
    // get 请求
    // get http://localhost:3000/cgi-bin/a/b/not_exist_cgi?activeModule=error_not_login
    // req.headers.host="localhost:3000"
    // req.params[0]="/cgi-bin/a/b/not_exist_cgi"
    // req.baseUrl=""
    // req.originalUrl="/cgi-bin/a/b/not_exist_cgi?activeModule=error_not_login"
    // req.url="/cgi-bin/a/b/not_exist_cgi?activeModule=error_not_login"
    // req.method="GET"
    // req.OriginalMethod="GET"
    // req.query.activeModule = "error_not_login"

    // post 请求
    // post http://localhost:3000/cgi-bin/a/b/not_exist_cgi data={activeModule:"error_not_login"}
    // req.params[0]="/cgi-bin/a/b/not_exist_cgi"
    // req.baseUrl=""
    // req.originalUrl="/cgi-bin/a/b/not_exist_cgi"
    // req.url="/cgi-bin/a/b/not_exist_cgi"
    // req.method="POST"
    // req.OriginalMethod="POST"
    // req.body.activeModule = "error_not_login"

    // 未匹配到的请求将会来到这里
    // console.log('[use]', req.url, req.query._m_from);

    // 判断是否已经是第二次请求了。
    // 请求本地服务的时候，可能会陷入死循环中，因此此处校验最多只请求一次。
    const isRequested = !!req.query._m_from;

    const opts = {
      url: 'http://' + req.headers.host + req.url,
      headers: req.headers,
      jar: true,
      // timeout: 4000,
      qs: {
        _m_from: 1
      }
    };

    if (res.locals.isDisabled) {
      res.append('matman-disable', res.locals.mockerName);
    }

    if (req.method === 'GET' && !isRequested) {
      request
        .get(_.merge({}, opts))
        .on('response', function (response) {
          // console.log(response.statusCode) // 200
        })
        .on('error', function (err) {
          console.error(err);
          res.status(500).send(err.stack);
        })
        .pipe(res);
    } else if (req.method === 'POST' && !isRequested) {
      request
        .post(_.merge({}, opts, {
          form: req.body,
        }))
        .on('response', function (response) {
          // console.log(response.statusCode)
        })
        .on('error', function (err) {
          console.error(err);
          res.status(500).send(err.stack);
        })
        .pipe(res);
    } else {
      if (!res.locals.data) {
        res.status(404);
        res.locals.data = {};
      }

      router.render(req, res);
    }

  });

  router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send(err.stack);
  });

  return router;
};
