const version = require('./MatmanVersion');
const util = require('./util');
const run = require('./run');

module.exports = {
  version: version,
  util: util,
  run: run,
  logger: global.matmanLogger
};