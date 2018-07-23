const express = require('express');
const methodOverride = require('method-override');
const _ = require('lodash');
const request = require('request');
const bodyParser = require('../body-parser');
const initPlugins = require('../../plugins');

module.exports = (entry) => {
  // Create router
  // http://expressjs.com/en/4x/api.html#router
  const router = express.Router();

  // Add middlewares
  router.use(methodOverride());
  router.use(bodyParser);

  // Expose render
  router.render = (req, res) => {
    res.jsonp(res.locals.data);
  };

  // 所有的请求都会经过这里，可以做一些类似权限控制的事情
  router.all('*', function (req, res, next) {
    // res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Origin', req.get('Origin'));
    next();
  });

  // 初始化插件
  initPlugins(router, entry);

  router.use((req, res) => {
    // get 请求
    // get http://localhost:9527/cgi-bin/a/b/not_exist_cgi?activeModule=error_not_login
    // req.headers.host="localhost:9527"
    // req.params[0]="/cgi-bin/a/b/not_exist_cgi"
    // req.baseUrl=""
    // req.originalUrl="/cgi-bin/a/b/not_exist_cgi?activeModule=error_not_login"
    // req.url="/cgi-bin/a/b/not_exist_cgi?activeModule=error_not_login"
    // req.method="GET"
    // req.OriginalMethod="GET"
    // req.query.activeModule = "error_not_login"

    // post 请求
    // post http://localhost:9527/cgi-bin/a/b/not_exist_cgi data={activeModule:"error_not_login"}
    // req.params[0]="/cgi-bin/a/b/not_exist_cgi"
    // req.baseUrl=""
    // req.originalUrl="/cgi-bin/a/b/not_exist_cgi"
    // req.url="/cgi-bin/a/b/not_exist_cgi"
    // req.method="POST"
    // req.OriginalMethod="POST"
    // req.body.activeModule = "error_not_login"

    // 未匹配到的请求将会来到这里
    console.log('[use]', req.url, req.query._m_from);

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

    // 设置当前请求是被匹配住了，但是因为配置了忽略，因此最终走现网数据，不用 mock
    if (res.locals.isDisabled) {
      res.append('x-matman-disable', res.locals.mockerName);
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
          form: req.body
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

      // TODO 2018/6/11 helinjiang: 要优化下这里，正常应该是404的，不知道为什么会走到这里
      router.render(req, res);
    }

  });

  router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send(err.stack);
  });

  return router;
};
