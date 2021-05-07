const { NetworkCondition } = require('../../../../npm/matman-plugin-puppeteer');

module.exports = new NetworkCondition({
  download: ((1.6 * 1000 * 1000) / 8) * 0.9,
  upload: ((750 * 1000) / 8) * 0.9,
  latency: 150 * 3.75,
});

