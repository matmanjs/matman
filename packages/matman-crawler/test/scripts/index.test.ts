import 'mocha';
import { expect } from 'chai';

import * as matmanCrawler from '../../src/index';

describe('./index.ts', () => {
  it('export should be correct', () => {
    expect(matmanCrawler).to.have.all.keys('build');
  });
});
