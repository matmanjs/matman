const chai = require('chai');
const expect = chai.expect;

const { MATMAN_CONFIG_FILE } = require('../../lib/config');

describe('./config.js', () => {
    it('MATMAN_CONFIG_FILE should be correct', () => {
        expect(MATMAN_CONFIG_FILE).to.equal('matman.config.js');
    });
});
