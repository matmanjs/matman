const request = require('./request');
const url = require('./url');

module.exports = {
  requestInMock: request.requestInMock,
  query: url.query,
  param: url.param
};