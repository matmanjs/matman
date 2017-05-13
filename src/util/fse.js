var fse = require('fs-extra');
var Promise = require('bluebird');

module.exports = Promise.promisifyAll(fse);
