'use strict';

var fse = require('fs-extra');
var Promise = require('bluebird');

module.exports = Promise.promisifyAll(fse);
//# sourceMappingURL=fse.js.map