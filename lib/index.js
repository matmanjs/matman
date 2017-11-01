'use strict';

var version = require('./MatmanVersion');
var util = require('./util');
var run = require('./run');

module.exports = {
  version: version,
  util: util,
  run: run,
  logger: global.matmanLogger
};
//# sourceMappingURL=index.js.map