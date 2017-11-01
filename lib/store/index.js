'use strict';

var low = require('lowdb');
var FileSync = require('lowdb/adapters/FileSync');

function getDB(fullPath) {
  return low(new FileSync(fullPath));
}

module.exports = {
  getDB: getDB
};
//# sourceMappingURL=index.js.map