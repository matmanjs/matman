'use strict';

var baseRouter = require('../../server/router-handler/base-router');

var PLUGIN_NAME = 'mocker';
var HANDLER_NAME_FIELD = 'mockerName';

module.exports = function (router, handlerParser) {

  // GET /sys-cgi/mocker 所有的 mocker 列表信息
  baseRouter.initGetList(router, PLUGIN_NAME, function (req, res) {
    var mockerList = handlerParser.getHandlerListByPlugin(PLUGIN_NAME);

    res.jsonp(mockerList);
  });

  // GET /sys-cgi/mocker/:mockerName 获得这个 mocker 的信息
  baseRouter.initGetOne(router, PLUGIN_NAME, HANDLER_NAME_FIELD, function (req, res) {
    var result = handlerParser.getHandler(req.params[HANDLER_NAME_FIELD]);

    res.jsonp(result);
  });

  // POST /sys-cgi/mocker/:mockerName 设置这个 mocker 的信息
  baseRouter.initPostOne(router, PLUGIN_NAME, HANDLER_NAME_FIELD, function (req, res) {
    var result = handlerParser.updateHandler(req.params[HANDLER_NAME_FIELD], req.body);

    res.jsonp(result);
  });

  // GET /sys-cgi/mocker/:mockerName/readme 获得这个 mocker 的 readme 信息
  baseRouter.initGetOneReadMe(router, PLUGIN_NAME, HANDLER_NAME_FIELD, function (req, res) {
    res.jsonp({
      html: handlerParser.getReadMeContent(req.params[HANDLER_NAME_FIELD])
    });
  });
};
//# sourceMappingURL=router.js.map