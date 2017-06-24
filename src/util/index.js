const fse = require('./fse');
const file = require('./file');
const request = require('./request');

module.exports = {
  fse: fse,
  file: file,
  requestInMock: request.requestInMock
};