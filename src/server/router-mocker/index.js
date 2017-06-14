const express = require('express');
const methodOverride = require('method-override');
const _ = require('lodash');
const bodyParser = require('../body-parser');
const mixins = require('../mixins');

module.exports = (source) => {
  // Create router
  const router = express.Router();

  // Add middlewares
  router.use(methodOverride());
  router.use(bodyParser);

  // Expose database
  router.db = { name: 'mocker' };

  // Expose render
  router.render = (req, res) => {
    res.jsonp(res.locals.data)
  };

  // GET /list
  router.use('/list', (req, res) => {
    res.jsonp({ name: 'list' });
  });

  router.use((req, res) => {
    // if (!res.locals.data) {
    //   res.status(404);
    //   res.locals.data = {};
    // }

    router.render(req, res);
  });

  router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send(err.stack);
  });

  return router;
};
