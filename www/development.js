const path = require('path');

const matmanServer = require('../src/server');
const server = matmanServer.create();
const routerMocker = matmanServer.routerMocker(path.join(__dirname, '../tmp/demo/src/app.js'));
const middlewares = matmanServer.mockServer();

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// Add custom routes before JSON Server router
// server.get('/echo', (req, res) => {
//     res.jsonp(req.query)
// });

// https://now.qq.com/cgi-bin/now/web/red_envelope/is_new_user
// http://localhost:3000/cgi-bin/now/web/red_envelope/is_new_user

// Add this before server.use(router)
// server.use(matmanServer.rewriter({
//   '/api/': '/',
//   '/blog/:resource/:id/show': '/:resource/:id'
// }));

// Use default router
// server.use(router);
server.use(routerMocker);
// server.use('/mocker', routerMocker);

// GET /*
// server.get('/*', function (req, res) {
//   res.jsonp({ url2: req.url });
// });

server.listen(3000, () => {
  console.log('matman server is running')
});