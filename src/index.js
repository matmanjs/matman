const version = require('./MatmanVersion');
const util = require('./util');

const Mocker = require('./mocker/Mocker');
const MockerParser = require('./mocker/MockerParser');
const mockerUtil = require('./mocker/util');

const matmanQuery = require('./business/matman-query');

const ClientScript = require('./tester/ClientScript');

module.exports = {
  version: version,
  util: util,
  Mocker: Mocker,
  MockerParser: MockerParser,
  MatmanQuery: matmanQuery.MatmanQuery,
  QUERY_KEY: matmanQuery.QUERY_KEY,
  mockerUtil: mockerUtil,
  ClientScript: ClientScript,

};