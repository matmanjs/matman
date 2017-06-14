const low = require('lowdb');
const fileAsync = require('lowdb/lib/storages/file-async');

const RETURN_ID_KEY = 'returnId';

function getDB(fullPath) {
  return low(fullPath, { storage: fileAsync });
}

function getValue(db, key) {
  return db.get(key).value();
}

function getReturnId(db) {
  return getValue(db, RETURN_ID_KEY);
}

function setReturnId(db, value) {
  db.set(RETURN_ID_KEY, value)
    .write();
}

module.exports = {
  getDB: getDB,
  getValue: getValue,
  getReturnId: getReturnId,
  setReturnId: setReturnId
};