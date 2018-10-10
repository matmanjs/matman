const chai = require('chai');
const expect = chai.expect;

const { config } = require('../../lib');

describe('./config.js', () => {
  it('should be correct', () => {
    expect(config).to.eql({
      MATMAN_QUERY_KEY: '_matman',
      MOCK_MODULES: 'mock_modules'
    });
  });
});
