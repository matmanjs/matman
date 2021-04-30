const Nightmare = require('nightmare');

const nightmare = Nightmare({
  switches: {
    'proxy-server': '127.0.0.1:8899',
    'ignore-certificate-errors': true
  }
});

nightmare
  .goto('https://a.com')
  .click('#search_button_homepage')
  .wait('#links .result__a')
  .evaluate(() => document.querySelector('#links .result__a').href)
  .end();


const Nightmare = require('nightmare')
const chai = require('chai')
const expect = chai.expect

describe('test duckduckgo search results', () => {
  it('should find the nightmare github link first', function(done) {
    this.timeout('10s')

    const nightmare = Nightmare()
    nightmare
      .goto('https://a.com')
      .type('#search_form_input_homepage', 'github nightmare')
      .click('#search_button_homepage')
      .wait('#links .result__a')
      .evaluate(() => document.querySelector('#links .result__a').href)
      .end()
      .then(link => {
        expect(link).to.equal('https://github.com/segmentio/nightmare')
        done()
      })
  })
})
