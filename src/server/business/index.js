const path = require('path');
const util = require('../../util');

const ROOT_PROJECT = path.join(__dirname, '../../../');
const MOCK_MODULES_PATH = path.join(ROOT_PROJECT, './tmp/demo/src/mock_modules');

function getAllMockFiles() {
  let allMockFiles = [];

  util.getAll(MOCK_MODULES_PATH, { globs: ['*/mock/*.js'] }).forEach((entry) => {
    // console.log(entry.relativePath, path.parse(entry.relativePath));
    allMockFiles.push(entry.relativePath)
  });

  return allMockFiles;
}


function getMockResult(requestUrl, params){
  let mockModule = require('../../../tmp/demo/src/mock_modules/is_new_user/mock/4');
  return mockModule.desc;
//
// console.log(desc)
// // console.log(mockResult)
// let t1=Date.now();
// mockResult.then((data)=>{
//     let t2=Date.now();
//     console.log('cost',t2-t1)
//     console.log(data)
// })
}


module.exports = {
  getAllMockFiles: getAllMockFiles,
  getMockResult: getMockResult,
};


