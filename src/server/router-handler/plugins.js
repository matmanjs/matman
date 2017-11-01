const mockerRouter = require('../../plugins/mocker/router');
const reporterRouter = require('../../plugins/reporter/router');
const stubRouter = require('../../plugins/stub/router');

module.exports = (router, handlerParser) => {

  // 初始化 mocker
  mockerRouter(router, handlerParser);

  // 初始化 reporter
  reporterRouter(router, handlerParser);

  // 初始化 stub
  stubRouter(router, handlerParser);

};
