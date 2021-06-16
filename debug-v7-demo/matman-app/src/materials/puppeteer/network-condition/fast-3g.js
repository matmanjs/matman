const { NetworkCondition } = require('../../../../npm/matman-plugin-puppeteer');

// https://github.com/puppeteer/puppeteer/blob/main/src/common/NetworkConditions.ts
module.exports = new NetworkCondition(__filename, {
  download: ((500 * 1000) / 8) * 0.8,
  upload: ((500 * 1000) / 8) * 0.8,
  latency: 400 * 5,
});

