'use strict';

var path = require('path');
var business = require('./business');

module.exports = function (opts) {
  var stubBasePath = path.join(opts.SRC_PATH, opts.STUB_RELATIVE_PATH);

  var stubList = business.getStubList(stubBasePath);

  var server = require('http').createServer();

  var io = require('socket.io')(server, {
    serveClient: false,
    wsEngine: 'ws' // uws is not supported since it is a native module
  });

  var port = opts.wsPort || 3888;

  io.on('connect', function (socket) {
    console.log('connect ' + socket.id);

    // 此处遍历生成监听事件
    // console.log('stubList', stubList);
    stubList.forEach(function (stubData) {
      var SOCKET_NAME = stubData.target;

      // 每一个 stub 都监听其特定的消息
      // TODO 此处需要确认如果有多个同样的 SOCKET_NAME，则会发生什么事情，是否需要程序进行提示？
      socket.on(SOCKET_NAME, function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        console.log(Date.now(), SOCKET_NAME, socket.id, args);

        // 获取这个stub的激活状态的module，并返回到客户端
        business.getStubModule(stubBasePath, SOCKET_NAME).then(function (result) {
          // console.log('-then-', result);
          socket.emit(SOCKET_NAME, result.data);
        }).catch(function (err) {
          // console.error('-catch-', err);
          socket.emit('stub_error', err);
        });
      });
    });

    socket.on('disconnect', function () {
      console.log('disconnect ' + socket.id);
    });
  });

  server.listen(port, function () {
    return console.log('server listening on port ' + port);
  });
};
//# sourceMappingURL=index.js.map