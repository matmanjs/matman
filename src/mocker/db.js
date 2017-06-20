const low = require('lowdb');
const fileAsync = require('lowdb/lib/storages/file-async');

const ACTIVE_MODULE = '_cache.activeModule';

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
  db.set(ACTIVE_MODULE, value)
    .write();
}

module.exports = {
  getDB: getDB,
  getValue: getValue,
  getActiveModule: getActiveModule,
  setActiveModule: setActiveModule
};