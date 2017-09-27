'use strict';

var baseRouter = require('../../server/router-handler/base-router');

var PLUGIN_NAME = 'reporter';
var HANDLER_NAME_FIELD = 'reporterName';

module.exports = function (router, handlerParser) {

  // GET /sys-cgi/reporter 所有的 reporter 列表信息
  baseRouter.initGetList(router, PLUGIN_NAME, function (req, res) {
    var reporterList = handlerParser.getHandlerListByPlugin(PLUGIN_NAME);

    res.jsonp(reporterList);
  });

  // GET /sys-cgi/reporter/:reporterName 获得这个 reporter 的信息
  baseRouter.initGetOne(router, PLUGIN_NAME, HANDLER_NAME_FIELD, function (req, res) {
    var result = handlerParser.getHandler(req.params[HANDLER_NAME_FIELD]);

    res.jsonp(result);
  });

  // POST /sys-cgi/reporter/:reporterName 设置这个 reporter 的信息
  baseRouter.initPostOne(router, PLUGIN_NAME, HANDLER_NAME_FIELD, function (req, res) {
    var result = handlerParser.updateHandler(req.params[HANDLER_NAME_FIELD], req.body);

    res.jsonp(result);
  });

  // GET /sys-cgi/reporter/:reporterName/readme 获得这个 reporter 的 readme 信息
  baseRouter.initGetOneReadMe(router, PLUGIN_NAME, HANDLER_NAME_FIELD, function (req, res) {
    res.jsonp({
      html: handlerParser.getReadMeContent(req.params[HANDLER_NAME_FIELD])
    });
  });
};
//# sourceMappingURL=router.js.map