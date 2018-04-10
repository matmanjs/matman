// const matman = require('../../lib');
const matman = require('../../src');

const npmUserInfo = require('npm_user_info');

matman.run({
  ROOT_PATH: __dirname,
  definedHandlers: [npmUserInfo]
});