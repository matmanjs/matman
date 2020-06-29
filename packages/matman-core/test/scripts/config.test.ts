import 'mocha';
import {expect} from 'chai';

import {MATMAN_CONFIG_FILE, RUNNER_NAME} from '../../src/config';

describe('./config.js', () => {
  it('MATMAN_CONFIG_FILE should be correct', () => {
    expect(MATMAN_CONFIG_FILE).to.equal('matman.config.js');
  });

  it('RUNNER_NAME should be correct', () => {
    expect(RUNNER_NAME).to.eql({
      PUPPETEER: 'puppeteer',
      NIGHTMARE: 'nightmare',
    });
  });
});
