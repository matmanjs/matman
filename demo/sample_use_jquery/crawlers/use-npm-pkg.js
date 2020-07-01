const {useJquery} = require('web-crawl-util');

module.exports = () => {
  return {
    settingTxt: useJquery.getText('.js-options-toggle'),
    remarks: 'Got data by npm package: web-crawl-util',
  };
};
