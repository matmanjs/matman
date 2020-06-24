const userInfo = require('../../other-modules/user-json.json');

function getDescription() {
  return 'I am description';
}

module.exports = () => {
  return {
    say: 'hello, file-require-json-module.js!',
    description: getDescription(),
    userInfo,
  };
};
