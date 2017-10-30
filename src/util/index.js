const fse = require('./fse');
const request = require('./request');

module.exports = {
  fse: fse,
  requestInMock: request.requestInMock
};