import path from 'path';
import 'mocha';
import { expect } from 'chai';

import { requireSync, requireAsync } from '../../../src/util/require-file';

describe('./util/require-file.ts', () => {
  describe('check requireSync(filePath)', () => {
    it('requireSync(data/fixtures/util/matman.config.js) should return current', () => {
      const filePath = path.join(__dirname, '../../data/fixtures/util/matman.config.js');
      expect(requireSync(filePath)).to.eql({
        rootPath: path.dirname(filePath),
      });
    });
  });

  describe('check requireAsync(filePath)', () => {
    it('requireAsync(data/fixtures/util/matman.config.js) should return current', async () => {
      const checkBasePath = path.join(__dirname, '../../data/fixtures/util');
      const filePath = path.join(checkBasePath, 'matman.config.js');
      const content = await requireAsync(filePath);

      expect(content).to.eql({
        rootPath: path.dirname(filePath),
        default: {
          rootPath: checkBasePath,
        },
      });
    });
  });
});
