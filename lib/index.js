'use strict';

var version = require('./MatmanVersion');
var util = require('./util');

var Mocker = require('./mocker/Mocker');
var MockerParser = require('./mocker/MockerParser');
var mockerUtil = require('./mocker/util');

var matmanQuery = require('./business/matman-query');

var ClientScript = require('./tester/ClientScript');
var E2eTestAction = require('./tester/E2eTestAction');

var e2eTestScanPage = require('./tester/e2e-test-scan-page');
var getPreloadScriptPath = require('./tester/get-preload-script-path');

module.exports = {
  version: version,
  util: util,
  Mocker: Mocker,
  MockerParser: MockerParser,
  MatmanQuery: matmanQuery.MatmanQuery,
  QUERY_KEY: matmanQuery.QUERY_KEY,
  mockerUtil: mockerUtil,
  ClientScript: ClientScript,
  E2eTestAction: E2eTestAction,
  getPreloadScriptPath: getPreloadScriptPath,
  e2e: {
    scan: e2eTestScanPage
  }
};