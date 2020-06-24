function getDescription() {
  return 'I am description';
}

module.exports = () => {
  return {
    say: 'hello, simple-file.js!',
    description: getDescription(),
  };
};
