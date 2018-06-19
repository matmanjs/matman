const path = require('path');
const matman = require('../../src');

const ClientScript = matman.ClientScript;

const clientScript = new ClientScript({
  basePath: path.resolve(__dirname, '../../test/data/fixtures/demo_e2e_test/e2e_test'),
  buildPath: path.resolve(__dirname, './build')
});

// 获得所有的 mocker
console.log(clientScript.getEntry());
