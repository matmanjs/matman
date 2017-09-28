const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const ACTIVE_MODULE = 'activeModule';

function getDB(fullPath) {
  return low(new FileSync(fullPath));
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