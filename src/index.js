const version = require('./MatmanVersion');
const util = require('./util');

const Mocker = require('./mocker/Mocker');
const MockerParser = require('./mocker/MockerParser');
const mockerUtil = require('./mocker/util');

const matmanQuery = require('./business/matman-query');

module.exports = {
  version: version,
  util: util,
  Mocker: Mocker,
  MockerParser: MockerParser,
  matmanQuery: matmanQuery,
  mockerUtil: mockerUtil,
};