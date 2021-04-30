import 'mocha';
import { expect } from 'chai';

import { isURLMatch } from '../../../src/util/url';

describe('./util/url.ts', () => {
  describe('check isURLMatch(URLToCheck, partialURL, query)', () => {
    const URLToCheck = 'http://now.qq.com/maybe/report/pv?report_id=987';

    it('full path', () => {
      expect(isURLMatch(URLToCheck, 'http://now.qq.com/maybe/report/pv')).to.be.true;
    });

    it('partial full path', () => {
      expect(isURLMatch(URLToCheck, 'now.qq.com/maybe/report/pv')).to.be.true;
    });

    it('only partial pathname', () => {
      expect(isURLMatch(URLToCheck, 'report/pv')).to.be.true;
    });

    it('pathname is not the same', () => {
      expect(isURLMatch(URLToCheck, 'report/pv2')).to.be.false;
    });

    it('with query', () => {
      expect(isURLMatch(URLToCheck, 'report/pv', { report_id: 987 })).to.be.true;
    });

    it('with error query', () => {
      expect(isURLMatch(URLToCheck, 'report/pv', { report_id: 666 })).to.be.false;
    });

    it('with error query and error key', () => {
      expect(isURLMatch(URLToCheck, 'report/pv', { id: 987 })).to.be.false;
    });
  });
});
