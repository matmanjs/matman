'use strict';

var PLUGIN_NAME = 'stub';

module.exports = function (opts, app, handlerParser) {
  var server = require('http').createServer(app);
  var io = require('socket.io')(server);

  // io.set('transports', ['websocket', 'xhr-polling', 'jsonp-polling', 'htmlfile', 'flashsocket']);
  io.set('origins', '*:*');

  io.on('connection', function (socket) {
    console.log('connection ' + socket.id);

    // 监听 emitStub，传递特殊的值，然后再将指定的数据发送给客户端的特定事件
    socket.on('emitStub', function (data) {
      // broadcast.emit 会广播给其他连接了 websocket 的用户，但是不会广播给自己
      // 因此需要额外的 emit 发给自己以便校验
      // 必须要一次 broadcast.emit，因为我们是在 matman 系统进行操作然后广播给其他服务的
      // 必须要一次 emit，因为要进行校验
      socket.broadcast.emit(data.route, data.result);
      socket.emit(data.route, data.result);
    });

    var stubList = handlerParser.getHandlerListByPlugin(PLUGIN_NAME);
    // console.log('--stubList--', stubList);

    stubList.forEach(function (stubItem) {
      var SOCKET_ROUTE = stubItem.route;
      // console.log('==========SOCKET_ROUTE===========', SOCKET_ROUTE);

      // 每一个 stub 都监听其特定的消息
      // TODO 此处需要确认如果有多个同样的 SOCKET_ROUTE，则会发生什么事情，是否需要程序进行提示？
      socket.on(SOCKET_ROUTE, function (params) {
        var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        console.log(Date.now(), stubItem.disable, SOCKET_ROUTE, socket.id, params, opts);

        // websocket 名字可以通过传递参数来指定回调结果
        var emitEventName = opts.eventName || SOCKET_ROUTE;

        // 如果该项打桩为 disable，则不做任何处理
        if (stubItem.disable) {
          socket.emit(emitEventName, { _disable: true });
          return;
        }

        // TODO 此处应该可以支持任意的参数
        handlerParser.getHandleModuleResult(SOCKET_ROUTE, params).then(function (result) {
          socket.emit(emitEventName, result);
        }).catch(function (err) {
          socket.emit('stub_error', err);
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
//# sourceMappingURL=websocket.js.map