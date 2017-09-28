'use strict';

var express = require('express');

module.exports = {
  create: function create() {
    return express().set('json spaces', 2);
  },
  defaults: require('./defaults'),
  handlerServer: require('./handler-server'),
  // router: require('./router'),
  routerHandler: require('./router-handler'),
  rewriter: require('./rewriter'),
  bodyParser: require('./body-parser')
};
//# sourceMappingURL=index.js.map