const { debugCaseModule } = require('../../../../../packages/matman-plugin-puppeteer');
const caseModule = require('./case-01');

(async () => {
  await debugCaseModule(caseModule);
})();
