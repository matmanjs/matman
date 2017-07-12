'use strict';

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require('express');
var url = require('url');
var _ = require('lodash');

function updateQueryString(target, sourceUrl) {
  return ~sourceUrl.indexOf('?') ? _.assign(target, url.parse(sourceUrl, true).query) : {};
}

module.exports = function (routes) {
  var router = express.Router();

  router.get('/__rules', function (req, res) {
    res.json(routes);
  });

  (0, _keys2.default)(routes).forEach(function (route) {
    if (route.indexOf(':') !== -1) {
      router.all(route, function (req, res, next) {
        // Rewrite target url using params
        var target = routes[route];
        for (var param in req.params) {
          target = target.replace(':' + param, req.params[param]);
        }
        req.url = target;
        req.query = updateQueryString(req.query, req.url);
        next();
      });
    } else {
      router.all(route + '*', function (req, res, next) {
        // Rewrite url by replacing prefix
        req.url = req.url.replace(route, routes[route]);
        req.query = updateQueryString(req.query, req.url);
        next();
      });
    }
  });

  return router;
};
//# sourceMappingURL=rewriter.js.map