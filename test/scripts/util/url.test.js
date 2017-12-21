import { expect } from 'chai';

import urlUtil from '../../../src/util/url';

describe('util/url.js query()', () => {
  it('name is undefined', () => {
    let result = urlUtil.query('');
    expect(result).to.be.empty;
  });

  it('url is undefined', () => {
    let result = urlUtil.query('k');
    expect(result).to.be.empty;
  });

  it('for query of url', () => {
    let result = urlUtil.query('k', '?k=1&p=2');
    expect(result).to.equal('1');
  });

  it('for url', () => {
    let result = urlUtil.query('k', 'http://domain.com?k=1&p=2');
    expect(result).to.equal('1');
  });

  it('for query-like', () => {
    let result = urlUtil.query('k', 'k=1&p=2');
    expect(result).to.equal('1');
  });
});

describe('util/url.js param()', () => {
  it('opts is undefined', () => {
    let result = urlUtil.param('');
    expect(result).to.be.empty;
  });

  it('{a:1}', () => {
    let result = urlUtil.param({ a: 1 });
    expect(result).to.equal('a=1');
  });

  it('{a:1,b:1}', () => {
    let result = urlUtil.param({ a: 1, b: 1 });
    expect(result).to.equal('a=1&b=1');
  });

  it('{a:[]}', () => {
    let result = urlUtil.param({ a: [] });
    expect(result).to.equal('a=%5B%5D');
  });

  it('{a:[{b:1},{b:2}]}', () => {
    let result = urlUtil.param({ a: [{ b: 1 }, { b: 2 }] });
    expect(result).to.equal('a=%5B%7B%22b%22%3A1%7D%2C%7B%22b%22%3A2%7D%5D');
  });

});

describe('util/url.js query() and param()', () => {
  let opts = {
    _matman: [{
      _m_name: 'demo_simple',
      _m_target: 'success',
      _m_disable: 0
    }, {
      _m_name: 'demo_simple2',
      _m_target: 'fail',
      _m_disable: 1
    }]
  };

  let paramResult = urlUtil.param(opts);
  let queryResult = urlUtil.query('_matman', paramResult);

  it('paramResult is OK', () => {
    expect(paramResult).to.equal('_matman=%5B%7B%22_m_name%22%3A%22demo_simple%22%2C%22_m_target%22%3A%22success%22%2C%22_m_disable%22%3A0%7D%2C%7B%22_m_name%22%3A%22demo_simple2%22%2C%22_m_target%22%3A%22fail%22%2C%22_m_disable%22%3A1%7D%5D');
  });

  it('queryResult is OK', () => {
    expect(queryResult).to.equal('[{"_m_name":"demo_simple","_m_target":"success","_m_disable":0},{"_m_name":"demo_simple2","_m_target":"fail","_m_disable":1}]');
  });

  it('JSON.parse(queryResult) is OK', () => {
    expect(JSON.parse(queryResult)).to.eql([{
      '_m_name': 'demo_simple',
      '_m_target': 'success',
      '_m_disable': 0
    }, {
      '_m_name': 'demo_simple2',
      '_m_target': 'fail',
      '_m_disable': 1
    }]);
  });

});
