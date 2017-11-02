const path = require('path');
const baseRouter = require('../../server/router-handler/base-router');

const PLUGIN_NAME = 'stub';
const HANDLER_NAME_FIELD = 'stubName';

module.exports = (router, handlerParser) => {

  // GET /sys-cgi/stub 所有的 stub 列表信息
  baseRouter.initGetList(router, PLUGIN_NAME, (req, res) => {
    let stubList = handlerParser.getHandlerListByPlugin(PLUGIN_NAME);

    res.jsonp(stubList);
  });

  // GET /sys-cgi/stub/:stubName 获得这个 stub 的信息
  baseRouter.initGetOne(router, PLUGIN_NAME, HANDLER_NAME_FIELD, (req, res) => {
    let result = handlerParser.getHandler(req.params[HANDLER_NAME_FIELD]);

    // 附加一下本地的路径
    if (result) {
      result._localPath = path.join(handlerParser.basePath, result.name);
    }

    res.jsonp(result);
  });

  // POST /sys-cgi/stub/:stubName 设置这个 stub 的信息
  baseRouter.initPostOne(router, PLUGIN_NAME, HANDLER_NAME_FIELD, (req, res) => {
    let result = handlerParser.updateHandler(req.params[HANDLER_NAME_FIELD], req.body);

    res.jsonp(result);
  });

  // GET /sys-cgi/stub/:stubName/readme 获得这个 stub 的 readme 信息
  baseRouter.initGetOneReadMe(router, PLUGIN_NAME, HANDLER_NAME_FIELD, (req, res) => {
    res.jsonp({
      html: handlerParser.getReadMeContent(req.params[HANDLER_NAME_FIELD])
    });
  });

};
