'use strict';

var baseRouter = require('../../server/router-handler/base-router');

var PLUGIN_NAME = 'stub';
var HANDLER_NAME_FIELD = 'stubName';

module.exports = function (router, handlerParser) {

  // GET /sys-cgi/stub 所有的 stub 列表信息
  baseRouter.initGetList(router, PLUGIN_NAME, function (req, res) {
    var stubList = handlerParser.getHandlerListByPlugin(PLUGIN_NAME);

    res.jsonp(stubList);
  });

  // GET /sys-cgi/stub/:stubName 获得这个 stub 的信息
  baseRouter.initGetOne(router, PLUGIN_NAME, HANDLER_NAME_FIELD, function (req, res) {
    var result = handlerParser.getHandler(req.params[HANDLER_NAME_FIELD]);

    res.jsonp(result);
  });

  // POST /sys-cgi/stub/:stubName 设置这个 stub 的信息
  baseRouter.initPostOne(router, PLUGIN_NAME, HANDLER_NAME_FIELD, function (req, res) {
    var result = handlerParser.updateHandler(req.params[HANDLER_NAME_FIELD], req.body);

    res.jsonp(result);
  });

  // GET /sys-cgi/stub/:stubName/readme 获得这个 stub 的 readme 信息
  baseRouter.initGetOneReadMe(router, PLUGIN_NAME, HANDLER_NAME_FIELD, function (req, res) {
    res.jsonp({
      html: handlerParser.getReadMeContent(req.params[HANDLER_NAME_FIELD])
    });
  });
};
//# sourceMappingURL=router.js.map