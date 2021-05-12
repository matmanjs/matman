const { debugCaseModule } = require('../../../../../packages/matman-plugin-puppeteer');
const caseModule = require('./case-01');

debugCaseModule(caseModule, {
  doNotCloseBrowser: false,
})
  .then(data => {
    console.log(JSON.stringify(data, null, 2));
  })
  .catch(err => {
    console.error(err);
  });
