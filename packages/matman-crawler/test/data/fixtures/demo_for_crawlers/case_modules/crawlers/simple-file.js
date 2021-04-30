function getDescription() {
  return 'I am description';
}

module.exports = () => ({
  say: 'hello, simple-file.js!',
  description: getDescription(),
});
