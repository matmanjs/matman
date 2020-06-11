import 'mocha';
import {expect} from 'chai';

import {MATMAN_CONFIG_FILE} from '../../src/config';

describe('./config.js', () => {
  it('MATMAN_CONFIG_FILE should be correct', () => {
    expect(MATMAN_CONFIG_FILE).to.equal('matman.config.js');
  });
});
