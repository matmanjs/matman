module.exports = function (opts = {}, app) {
  // 触发 onBeforeServerListen 事件
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

    // 此处遍历生成监听事件
    // console.log('stubList', stubList);
    // stubList.forEach((stubData) => {
    //   const SOCKET_NAME = stubData.target;
    //
    //   // 每一个 stub 都监听其特定的消息
    //   // TODO 此处需要确认如果有多个同样的 SOCKET_NAME，则会发生什么事情，是否需要程序进行提示？
    //   socket.on(SOCKET_NAME, function (...args) {
    //     console.log(Date.now(), SOCKET_NAME, socket.id, args);
    //
    //     // 获取这个stub的激活状态的module，并返回到客户端
    //     business.getStubModule(stubBasePath, SOCKET_NAME)
    //       .then((result) => {
    //         // console.log('-then-', result);
    //         socket.emit(SOCKET_NAME, result.data);
    //       })
    //       .catch((err) => {
    //         // console.error('-catch-', err);
    //         socket.emit('stub_error', err);
    //       });
    //   });
    // });

    // when the user disconnects.. perform this
    socket.on('disconnect', function () {
      console.log('disconnect ' + socket.id);
    });
  });

  return server;
};
