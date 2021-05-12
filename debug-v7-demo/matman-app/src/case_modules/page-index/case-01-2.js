const { debugCaseModule } = require('../../../../../packages/matman-plugin-puppeteer');
const caseModule = require('./case-01');

debugCaseModule(
  caseModule,
  {
    doNotCloseBrowser: false,
  },
  {
    showResultInConsole: true,
  },
)
  .then(data => {
    // console.log(data);
  })
  .catch(err => {
    console.error(err);
  });
