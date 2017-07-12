'use strict';

var url = require('url');

module.exports = function (req) {
  var root = url.format({
    protocol: req.protocol,
    host: req.get('host')
  });

  return '' + root + req.originalUrl;
};
//# sourceMappingURL=get-full-url.js.map