var path = require('path');

var fse = require('./util/fse');
var mockerModuleTool = require('./mocker/mocker-module-tool');

const ROOT_PROJECT = path.join(__dirname, './');

var targetPath = './test/purejson.js';

var result = mockerModuleTool.getResult(targetPath);

console.log(result);

mockerModuleTool.save(targetPath, './test/output/r.json')
    .then((data) => {
        console.log('then', data);
    })
    .catch((err) => {
        console.log('catch', err);
    })


