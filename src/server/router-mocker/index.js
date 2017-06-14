const express = require('express');
const methodOverride = require('method-override');
const _ = require('lodash');
const bodyParser = require('../body-parser');
const business = require('../business');

module.exports = (entryPath) => {
  const entry = require(entryPath);

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

  // GET /*
  router.get('/*', function (req, res) {
    business.getMockResult(req, entry)
      .then((result) => {
        res.jsonp({
          url: req.url,
          params: req.params,
          query: req.query,
          data: result
        });
      })
      .catch((err) => {
        res.jsonp({
          url: req.url,
          params: req.params,
          query: req.query,
          err: err
        });
      });
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
