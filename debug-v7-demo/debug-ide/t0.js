const path = require('path');
const fsHandler = require('fs-handler');

const definedInstanceDir = path.join(__dirname, '../matman-app/src/materials');

const result = {};
fsHandler.search.getAll(definedInstanceDir, { globs: ['**'] }).forEach(item => {
  console.log(item);

  if (item.isDirectory()) {
    console.log('目录\n');
  }
});

console.log(result);
