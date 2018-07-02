const express = require('express');

module.exports = {
  create: () => express().set('json spaces', 2),
  middleware: require('./middleware/index'),
  router: require('./router/index'),
  bodyParser: require('./body-parser')
};
