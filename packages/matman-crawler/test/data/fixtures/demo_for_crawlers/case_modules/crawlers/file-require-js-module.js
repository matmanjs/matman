const userInfo = require('../../other-modules/user-js');

function getDescription() {
  return 'I am description';
}

module.exports = () => ({
  say: 'hello, file-require-js-module.js!',
  description: getDescription(),
  userInfo,
});
