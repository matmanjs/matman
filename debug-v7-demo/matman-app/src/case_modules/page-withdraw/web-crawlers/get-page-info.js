const { useJquery } = require('web-crawl-util');

module.exports = () => {
  return {
    title: useJquery.getText('#root h2'),
    moneyWording: useJquery.getText('#money'),
  };
};
