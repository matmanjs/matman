'use strict';

var express = require('express');
var methodOverride = require('method-override');
var _ = require('lodash');
var request = require('request');
var bodyParser = require('../body-parser');
var HandlerParser = require('../../parser/handler-parser').default;
var initPlugins = require('./plugins');
var util = require('../../util');

module.exports = function (entry) {
  var handlerParser = new HandlerParser(entry.HANDLER_PATH, entry.DATA_PATH);

  var handlerList = handlerParser.parseAndSave();

  // Create router
  // http://expressjs.com/en/4x/api.html#router
  var router = express.Router();

  // Add middlewares
  router.use(methodOverride());
  router.use(bodyParser);

  // Expose render
  router.render = function (req, res) {
    res.jsonp(res.locals.data);
  };

  initPlugins(router, handlerParser);

  // 所有的请求都会经过这里，可以做一些类似权限控制的事情
  router.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    next();
  });

  // 根据用户配置的路由关系，进行解析
  // console.log('handlerList', handlerList);
  handlerList.forEach(function (handlerData) {
    // 默认是 get 请求，除非定义 method 字段
    var METHOD = (handlerData.method || 'get').toLowerCase();
    var ROUTE_PATH = handlerData.route;

    // http://expressjs.com/en/4x/api.html#router.METHOD
    router[METHOD](ROUTE_PATH, function (req, res, next) {
      // Express的req对象，详见 http://expressjs.com/en/4x/api.html#req

      // post 请求
      // handlerData.route="/cgi-bin/a/b/post_cgi"
      // post http://localhost:3000/cgi-bin/a/b/post_cgi data={activeModule:"error_not_login"}
      // req.baseUrl=""
      // req.originalUrl="/cgi-bin/a/b/post_cgi"
      // req.url="/cgi-bin/a/b/post_cgi"
      // req.method="POST"
      // req.OriginalMethod="POST"
      // req.body.activeModule = "error_not_login"
      // req.body = data

      // get 请求
      // handlerData.route="/cgi-bin/a/b/simple_cgi"
      // get http://localhost:3000/cgi-bin/a/b/simple_cgi?activeModule=error_not_login
      // req.baseUrl=""
      // req.originalUrl="/cgi-bin/a/b/simple_cgi?activeModule=error_not_login"
      // req.url="/cgi-bin/a/b/simple_cgi?activeModule=error_not_login"
      // req.method="GET"
      // req.OriginalMethod="GET"
      // req.query.activeModule = "error_not_login"

      // get 请求且route为匹配类型
      // handlerData.route="/cgi-bin/a/b/id/:id"
      // get http://localhost:3000/cgi-bin/a/b/id/1?activeModule=error_not_login
      // req.baseUrl=""
      // req.originalUrl="/cgi-bin/a/b/id/1?activeModule=error_not_login"
      // req.url="/cgi-bin/a/b/id/1?activeModule=error_not_login"
      // req.method="GET"
      // req.OriginalMethod="GET"
      // req.query.activeModule = "error_not_login"
      // req.params.id = "1"

      // console.log(req.headers.referer)
      // 目前只支持 plugin=mocker 的场景，_m_name=该模块的名字，_m_target=该模块的值对应的名字,_m_disable
      var paramsFromReferer = void 0;
      try {
        paramsFromReferer = JSON.parse(util.query('_matman', req.headers.referer)) || [];
      } catch (e) {
        paramsFromReferer = [];
      }
      // let paramsFromReferer = [{
      //   _m_name: 'demo_simple11',
      //   _m_target: 'success',
      //   _m_disable: 0
      // }];

      console.log('====paramsFromReferer=====', paramsFromReferer);

      var isDisable = void 0;

      // 判断该路由的名字是否在referer中
      var matchedReferer = paramsFromReferer.filter(function (item) {
        return item._m_name === handlerData.name;
      })[0];

      console.log('====matchedReferer=====', matchedReferer);

      if (matchedReferer) {
        // referer 里面的请求参数拥有最高优先级，因为这种场景比较特殊，主要用于自动化测试之用
        isDisable = matchedReferer._m_disable;
      } else {
        // 从请求 req 或者 config.json 文件中检查当前请求是否需要禁用 handle 服务
        isDisable = req.query._m_disable || req.body._m_disable;
        if (!isDisable) {
          // 此处要重新获取新的数据，以便取到缓存的。
          // TODO 此处还可以优化，比如及时更新缓存中的数据，而不需要每次都去获取
          var curMockerData = handlerParser.getHandler(handlerData.name, true);
          isDisable = curMockerData.disable;
        }
      }

      if (isDisable) {
        // 如果当前禁用了 handle 服务，则不处理
        res.locals.isDisabled = true;
        res.locals.handlerName = handlerData.name;
        next();
      } else {
        var url = ROUTE_PATH;
        var params = METHOD === 'post' ? req.body : req.query;

        // 还要合并一下来自 url path 中的参数值
        // referer 里面的请求参数拥有最高优先级，因为这种场景比较特殊，主要用于自动化测试之用
        params = _.merge({}, params, req.params, matchedReferer);

        // 请求
        handlerParser.getHandleModuleResultForHttp(url, params, req).then(function (result) {
          res.append('matman-handler', result.extra.handlerInfo.name);
          res.append('matman-handle-module', result.extra.handleModuleInfo.name);
          res.jsonp(result.data);
        }).catch(function (err) {
          // 注意 err 有可能是 Error 对象，也可能是普通的字符串或对象
          var errMsg = err && err.stack || err;

          console.error(errMsg);

          res.status(500).send(errMsg);
        });
      }
    });
  });

  router.use(function (req, res) {
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
    var isRequested = !!req.query._m_from;

    var opts = {
      url: 'http://' + req.headers.host + req.url,
      headers: req.headers,
      jar: true,
      // timeout: 4000,
      qs: {
        _m_from: 1
      }
    };

    if (res.locals.isDisabled) {
      res.append('matman-disable', res.locals.handlerName);
    }

    if (req.method === 'GET' && !isRequested) {
      request.get(_.merge({}, opts)).on('response', function (response) {
        // console.log(response.statusCode) // 200
      }).on('error', function (err) {
        console.error(err);
        res.status(500).send(err.stack);
      }).pipe(res);
    } else if (req.method === 'POST' && !isRequested) {
      request.post(_.merge({}, opts, {
        form: req.body
      })).on('response', function (response) {
        // console.log(response.statusCode)
      }).on('error', function (err) {
        console.error(err);
        res.status(500).send(err.stack);
      }).pipe(res);
    } else {
      if (!res.locals.data) {
        res.status(404);
        res.locals.data = {};
      }

      router.render(req, res);
    }
  });

  router.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send(err.stack);
  });

  // 携带变量出去
  router._handlerParser = handlerParser;

  return router;
};
//# sourceMappingURL=index.js.map