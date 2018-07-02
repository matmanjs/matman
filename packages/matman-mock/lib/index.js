'use strict';

var matmanQuery = require('./business/matman-query');

module.exports = {
  util: require('./util'),
  Mocker: require('./model/Mocker'),
  MockerParser: require('./model/MockerParser'),
  MatmanQuery: matmanQuery.MatmanQuery,
  QUERY_KEY: matmanQuery.QUERY_KEY
};