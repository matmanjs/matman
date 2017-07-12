'use strict';

var low = require('lowdb');
var fileAsync = require('lowdb/lib/storages/file-async');

var ACTIVE_MODULE = 'activeModule';

function getDB(fullPath) {
  return low(fullPath, { storage: fileAsync });
}

function getValue(db, key) {
  return db.get(key).value();
}

function getActiveModule(db) {
  return getValue(db, ACTIVE_MODULE);
}

function setActiveModule(db, value) {
  db.set(ACTIVE_MODULE, value).write();
}

module.exports = {
  getDB: getDB,
  getValue: getValue,
  getActiveModule: getActiveModule,
  setActiveModule: setActiveModule
};
//# sourceMappingURL=db.js.map