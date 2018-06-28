'use strict';

var matmanQuery = require('./business/matman-query');

module.exports = {
  version: require('./MatmanVersion'),
  util: require('./util'),
  Mocker: require('./mocker/Mocker'),
  MockerParser: require('./mocker/MockerParser'),
  MatmanQuery: matmanQuery.MatmanQuery,
  QUERY_KEY: matmanQuery.QUERY_KEY,
  mockerUtil: require('./mocker/util'),
  ClientScript: require('./tester/ClientScript'),
  E2eTestAction: require('./tester/E2eTestAction'),
  getPreloadScriptPath: require('./tester/get-preload-script-path'),
  getBuildPath: require('./tester/get-build-path'),
  getConfigFilePath: require('./tester/get-config-file-path'),
  e2e: {
    scan: require('./tester/e2e-test-scan-page')
  }
};