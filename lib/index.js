'use strict';

var version = require('./MatmanVersion');
var util = require('./util');
var mocker = require('./mocker');
var tester = require('./tester');
var run = require('./run');

module.exports = {
  version: version,
  util: util,
  mocker: mocker,
  tester: tester,
  run: run,
  logger: global.matmanLogger
};
//# sourceMappingURL=index.js.map