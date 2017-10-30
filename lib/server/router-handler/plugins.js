'use strict';

var mockerRouter = require('../../plugins/mocker/router');
var reporterRouter = require('../../plugins/reporter/router');
var stubRouter = require('../../plugins/stub/router');

module.exports = function (router, handlerParser) {

  // 初始化 mocker
  mockerRouter(router, handlerParser);

  // 初始化 reporter
  reporterRouter(router, handlerParser);

  // 初始化 stub
  stubRouter(router, handlerParser);
};
//# sourceMappingURL=plugins.js.map