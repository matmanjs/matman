const PLUGIN_NAME = 'stub';

module.exports = function (opts, app, handlerParser) {
  const server = require('http').createServer(app);
  const io = require('socket.io')(server);

  io.on('connection', function (socket) {
    console.log('connection ' + socket.id);

    socket.on('emitStub', function (data) {
      // broadcast.emit 会广播给其他连接了 websocket 的用户，但是不会广播给自己
      // 因此需要额外的 emit 发给自己以便校验
      // 必须要一次 broadcast.emit，因为我们是在 matman 系统进行操作然后广播给其他服务的
      // 必须要一次 emit，因为要进行校验
      socket.broadcast.emit(data.route, data.result);
      socket.emit(data.route, data.result);
    });

    let stubList = handlerParser.getHandlerListByPlugin(PLUGIN_NAME);
    // console.log('--stubList--', stubList);

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
