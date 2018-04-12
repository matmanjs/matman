const request = require('./request');
const url = require('./url');
const NodeWatchFileSystem = require('./NodeWatchFileSystem');
const watch = require('./watch');

module.exports = {
  requestInMock: request.requestInMock,
  query: url.query,
  param: url.param,
  NodeWatchFileSystem: NodeWatchFileSystem,
  watch: watch
};