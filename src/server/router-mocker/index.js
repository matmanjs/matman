const express = require('express');
const methodOverride = require('method-override');
const _ = require('lodash');
const bodyParser = require('../body-parser');

module.exports = (source) => {
  // Create router
  const router = express.Router();

  // Add middlewares
  router.use(methodOverride());
  router.use(bodyParser);

  // Expose render
  router.render = (req, res) => {
    res.jsonp(res.locals.data)
  };

  // GET /list
  router.get('/list', (req, res) => {
    res.jsonp({ name: 'list' });
  });

  // GET /id/:id
  router.get('/id/:id', function (req, res) {
    res.jsonp({ id: req.params.id });
  });

  router.use((req, res) => {
    if (!res.locals.data) {
      res.status(404);
      res.locals.data = {};
    }

    router.render(req, res);
  });

  router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send(err.stack);
  });

  return router;
};
