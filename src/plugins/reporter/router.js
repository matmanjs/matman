const baseRouter = require('../../server/router-handler/base-router');

const PLUGIN_NAME = 'reporter';
const HANDLER_NAME_FIELD = 'reporterName';

module.exports = (router, handlerParser) => {

  // GET /sys-cgi/reporter 所有的 reporter 列表信息
  baseRouter.initGetList(router, PLUGIN_NAME, (req, res) => {
    let reporterList = handlerParser.getHandlerListByPlugin(PLUGIN_NAME);

    res.jsonp(reporterList);
  });

  // GET /sys-cgi/reporter/:reporterName 获得这个 reporter 的信息
  baseRouter.initGetOne(router, PLUGIN_NAME, HANDLER_NAME_FIELD, (req, res) => {
    let result = handlerParser.getHandler(req.params[HANDLER_NAME_FIELD]);

    res.jsonp(result);
  });

  // POST /sys-cgi/reporter/:reporterName 设置这个 reporter 的信息
  baseRouter.initPostOne(router, PLUGIN_NAME, HANDLER_NAME_FIELD, (req, res) => {
    let result = handlerParser.updateHandler(req.params[HANDLER_NAME_FIELD], req.body);

    res.jsonp(result);
  });

  // GET /sys-cgi/reporter/:reporterName/readme 获得这个 reporter 的 readme 信息
  baseRouter.initGetOneReadMe(router, PLUGIN_NAME, HANDLER_NAME_FIELD, (req, res) => {
    res.jsonp({
      html: handlerParser.getReadMeContent(req.params[HANDLER_NAME_FIELD])
    });
  });

};
