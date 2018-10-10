module.exports = function (opts, server, mockerParser) {
  const io = require('socket.io')(server);

  // 获取所有的 mocker 列表
  const mockerList = mockerParser.getAllMocker();

  // 设置运行跨域
  // io.set('transports', ['websocket', 'xhr-polling', 'jsonp-polling', 'htmlfile', 'flashsocket']);
  io.set('origins', '*:*');

  // 监听连接成功的事件，然后再连接成功之后，设置事件监听
  io.on('connection', function (socket) {
    console.log('connection ' + socket.id);

    // 监听 emitStub，传递特殊的值，然后再将指定的数据发送给客户端的特定事件
    // 一般用于管理后台的主动触发
    socket.on('emitStub', function (data) {
      // broadcast.emit 会广播给其他连接了 websocket 的用户，但是不会广播给自己
      // 因此需要额外的 emit 发给自己以便校验
      // 必须要一次 broadcast.emit，因为我们是在 matman 系统进行操作然后广播给其他服务的
      // 必须要一次 emit，因为要进行校验
      socket.broadcast.emit(data.route, data.result);
      socket.emit(data.route, data.result);

      socket.broadcast.emit('wsCallback', { data: data.result });
      socket.emit('wsCallback', { data: data.result });
    });

    // 遍历所有的 route 来绑定监听
    mockerList.forEach((mockerItem) => {
      // console.log(mockerItem);

      // mocker 的配置项在其 config 字段中
      const mockerConfig = mockerItem.config;

      // 只处理 plugin=async 的场景
      if (mockerConfig.plugin !== 'async') {
        return;
      }

      // 判断是否存在 route 字段，如果没有，则不再处理
      const SOCKET_ROUTE = mockerConfig.route;
      if (!SOCKET_ROUTE) {
        console.error('unknown SOCKET_ROUTE', mockerConfig);
        return;
      }

      // 每一个 async 都监听其特定的消息
      // TODO 此处需要确认如果有多个同样的 SOCKET_ROUTE，则会发生什么事情，是否需要程序进行提示？
      socket.on(SOCKET_ROUTE, function (params, opts = {}) {
        console.log(Date.now(), mockerConfig.disable, SOCKET_ROUTE, socket.id, params, opts);

        // websocket 名字可以通过传递参数来指定回调结果
        let emitEventName = opts.eventName || SOCKET_ROUTE;

        // 如果该项打桩为 disable，则不做任何处理
        if (mockerConfig.disable) {
          socket.emit(emitEventName, { _disable: true });
          socket.emit('wsCallback', { data: { _disable: true }, params: params, opts: opts });
          return;
        }

        let url = SOCKET_ROUTE;

        const resInfo = mockerParser.getResInfoByRoute(url, params);

        if (!resInfo) {
          let errMsg = 'Could not get reqInfo by route=' + url + ' and params=' + JSON.stringify(params);
          console.error(errMsg);
          socket.emit('async_error', errMsg);
          socket.emit('wsCallback', { data: errMsg, params: params, opts: opts });
          return;
        }

        resInfo.mockModuleItem.getResult(params)
          .then((result) => {
            // 延时返回
            let delay = resInfo.mockModuleItem.config.delay || 0;

            if (delay) {
              setTimeout(() => {
                socket.emit(emitEventName, result);
                socket.emit('wsCallback', { data: result, params: params, opts: opts });
              }, delay);
            } else {
              socket.emit(emitEventName, result);
              socket.emit('wsCallback', { data: result, params: params, opts: opts });
            }
          })
          .catch((err) => {
            // 注意 err 有可能是 Error 对象，也可能是普通的字符串或对象
            let errMsg = err && err.stack || err;

            console.error(errMsg);

            socket.emit('async_error', errMsg);
            socket.emit('wsCallback', { data: errMsg, params: params, opts: opts });
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
