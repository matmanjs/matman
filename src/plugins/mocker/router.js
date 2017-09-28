const baseRouter = require('../../server/router-handler/base-router');

const PLUGIN_NAME = 'mocker';
const HANDLER_NAME_FIELD = 'mockerName';

module.exports = (router, handlerParser) => {

  // GET /sys-cgi/mocker 所有的 mocker 列表信息
  baseRouter.initGetList(router, PLUGIN_NAME, (req, res) => {
    let mockerList = handlerParser.getHandlerListByPlugin(PLUGIN_NAME);

    res.jsonp(mockerList);
  });

  // GET /sys-cgi/mocker/:mockerName 获得这个 mocker 的信息
  baseRouter.initGetOne(router, PLUGIN_NAME, HANDLER_NAME_FIELD, (req, res) => {
    let result = handlerParser.getHandler(req.params[HANDLER_NAME_FIELD]);

    res.jsonp(result);
  });

  // POST /sys-cgi/mocker/:mockerName 设置这个 mocker 的信息
  baseRouter.initPostOne(router, PLUGIN_NAME, HANDLER_NAME_FIELD, (req, res) => {
    let result = handlerParser.updateHandler(req.params[HANDLER_NAME_FIELD], req.body);

    res.jsonp(result);
  });

  // GET /sys-cgi/mocker/:mockerName/readme 获得这个 mocker 的 readme 信息
  baseRouter.initGetOneReadMe(router, PLUGIN_NAME, HANDLER_NAME_FIELD, (req, res) => {
    res.jsonp({
      html: handlerParser.getReadMeContent(req.params[HANDLER_NAME_FIELD])
    });
  });

};
