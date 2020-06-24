import path from 'path';
import 'mocha';
import {expect} from 'chai';

import {getCallerPath} from '../../../src/util/caller';

describe('./util/caller.ts', () => {
  describe('check getCallerPath(caseModuleFilePath)', () => {
    it('full path', () => {
      const caseModuleFilePath = path.join(__dirname, '../../data/fixtures/util/case.js');
      expect(getCallerPath(caseModuleFilePath)).to.equal(caseModuleFilePath);
    });
  });
});
