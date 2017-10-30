const fse = require('./fse');
const request = require('./request');
const handle = require('./handle');

module.exports = {
  fse: fse,
  handle,
  requestInMock: request.requestInMock
};