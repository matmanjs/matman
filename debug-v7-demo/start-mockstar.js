const path = require('path');
const mockstarLocalServer = require('mockstar-local-server');

// 服务启动参数
const configOpts = {
  rootPath: __dirname,
  mockServerPath: path.resolve(__dirname, './matman-app/src/dependencies/mockstar/mockers'),
};

// 启动本地服务
const runServer = mockstarLocalServer.startServer(configOpts, (isSuccess, data) => {
  console.log('startServer callback', isSuccess, data);
});

// 3s 之后停止服务
// setTimeout(() => {
//     runServer.stop(() => {
//         console.log('stop server success!');
//     });
// }, 3000);

// 使用该方式，可以直接启动一个mockstar，而不一定需要配置 mockstar.config.js
