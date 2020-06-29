import path from 'path';
import 'mocha';
import {expect} from 'chai';

import {getCallerPath} from '../../../src/util/caller';
import getWhoCallMe from '../../data/helpers/case_module';

describe('./util/caller.ts', () => {
  describe('check getCallerPath(caseModuleFilePath)', () => {
    it('current file: caseModuleFilePath is undefined', () => {
      expect(getCallerPath()).to.equal(__filename);
    });

    it('demo: caseModuleFilePath is undefined', () => {
      expect(getWhoCallMe()).to.equal(path.join(__dirname, '../../data/helpers/case_module.ts'));
    });

    it('demo: caseModuleFilePath is exist', () => {
      expect(getWhoCallMe(path.join(__dirname, '../../data/helpers/case_module.ts'))).to.equal(
        __filename,
      );
    });
  });
});
