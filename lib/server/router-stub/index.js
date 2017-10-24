'use strict';

var express = require('express');
var methodOverride = require('method-override');
var _ = require('lodash');
var bodyParser = require('../body-parser');
var business = require('../../websocket/business');

module.exports = function (entry) {
  var stubList = business.getStubList(entry.STUB_PATH);

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

  // GET /sys-cgi/stub 所有的 stub 列表信息
  router.get('/sys-cgi/stub', function (req, res) {
    stubList = business.getStubList(entry.STUB_PATH);

    res.jsonp(stubList);
  });

  // GET /sys-cgi/stub/:stubName 获得这个 stub 的信息
  router.get('/sys-cgi/stub/:stubName', function (req, res) {
    var result = business.getStub(entry.STUB_PATH, req.params.stubName);

    res.jsonp(result);
  });

  // GET /sys-cgi/stub/:stubName/readme 获得这个 stub 的readme信息
  router.get('/sys-cgi/stub/:stubName/readme', function (req, res) {
    res.jsonp({
      html: business.getStubReadme(entry.STUB_PATH, req.params.stubName)
    });
  });

  // POST /sys-cgi/stub/:stubName 设置这个stub的信息
  router.post('/sys-cgi/stub/:stubName', function (req, res) {
    var result = business.updateStub(entry.STUB_PATH, req.params.stubName, req.body);

    res.jsonp(result);
  });

  // 所有的请求都会经过这里，可以做一些类似权限控制的事情
  router.all('*', function (req, res, next) {
    next();
  });

  router.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send(err.stack);
  });

  return router;
};
//# sourceMappingURL=index.js.map