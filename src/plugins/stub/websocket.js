const PLUGIN_NAME = 'stub';

module.exports = function (opts, app, handlerParser) {
  const server = require('http').createServer(app);
  const io = require('socket.io')(server);

  io.on('connection', function (socket) {
    console.log('connection ' + socket.id);

    // when the client emits 'typing', we broadcast it to others
    socket.on('typing', function (data) {
      socket.emit('typing', {
        username: data
      });
    });

    let stubList = handlerParser.getHandlerListByPlugin(PLUGIN_NAME);
    console.log('--stubList--', stubList);

    stubList.forEach((stubItem) => {
      const SOCKET_ROUTE = stubItem.route;
      console.log('==========SOCKET_ROUTE===========', SOCKET_ROUTE);

      // 每一个 stub 都监听其特定的消息
      // TODO 此处需要确认如果有多个同样的 SOCKET_ROUTE，则会发生什么事情，是否需要程序进行提示？
      socket.on(SOCKET_ROUTE, function (...args) {
        console.log(Date.now(), SOCKET_ROUTE, socket.id, args);

        // TODO 此处应该可以支持任意的参数
        handlerParser.getHandleModuleResult(SOCKET_ROUTE, args)
          .then((result) => {
            socket.emit(SOCKET_ROUTE, result);
          })
          .catch((err) => {
            socket.emit('stub_error!', err);
          });
      });
    });

    // when the user disconnects.. perform this
    socket.on('disconnect', function () {
      console.log('disconnect ' + socket.id);
    });
  });

  return server;
};
