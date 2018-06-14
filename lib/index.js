'use strict';

var version = require('./MatmanVersion');
var util = require('./util');

var Mocker = require('./mocker/Mocker');
var MockerParser = require('./mocker/MockerParser');
var mockerUtil = require('./mocker/util');

var matmanQuery = require('./business/matman-query');

module.exports = {
  version: version,
  util: util,
  Mocker: Mocker,
  MockerParser: MockerParser,
  MatmanQuery: matmanQuery.MatmanQuery,
  QUERY_KEY: matmanQuery.QUERY_KEY,
  mockerUtil: mockerUtil
};