const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

function getDB(fullPath) {
  return low(new FileSync(fullPath));
}

module.exports = {
  getDB: getDB
};