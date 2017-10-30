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
      const SOCKET_ROUTE = stubItem.name;

      // 每一个 stub 都监听其特定的消息
      // TODO 此处需要确认如果有多个同样的 SOCKET_ROUTE，则会发生什么事情，是否需要程序进行提示？
      socket.on(SOCKET_ROUTE, function (...args) {
        console.log(Date.now(), SOCKET_ROUTE, socket.id, args);

        // 通过路由，获得指定的 handler
        let result = handlerParser.getHandlerByRoute(SOCKET_ROUTE);
        console.log('--result--', SOCKET_ROUTE, result);

        // 获取这个stub的激活状态的module，并返回到客户端

        if (result) {
          socket.emit(SOCKET_ROUTE, result);
        } else {
          socket.emit('stub_error!');
        }
      });
    });

    // when the user disconnects.. perform this
    socket.on('disconnect', function () {
      console.log('disconnect ' + socket.id);
    });
  });

  return server;
};
