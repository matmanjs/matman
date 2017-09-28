const fse = require('./fse');
const file = require('./file');
const request = require('./request');
const handle = require('./handle');

module.exports = {
  fse: fse,
  file: file,
  handle,
  requestInMock: request.requestInMock
};