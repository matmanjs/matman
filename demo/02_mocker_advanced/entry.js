// const matman = require('../../lib');
const matman = require('../../src');

const demoUserInfo = require('matman-mocker-demo-user-info');

matman.run({
  ROOT_PATH: __dirname,
  definedHandlers: [demoUserInfo]
});