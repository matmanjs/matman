const mockerRouter = require('./mocker/router');

module.exports = (router, entry) => {

  // 初始化 mocker
  mockerRouter(router, entry);

};
