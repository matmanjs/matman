import path from 'path';
import 'mocha';
import {expect} from 'chai';

import {requireSync, requireAsync} from '../../../src/util/require-file';

describe('./util/require-file.ts', function () {
  describe('check requireSync(filePath)', function () {
    it('requireSync(data/fixtures/util/matman.config.js) should return current', function () {
      const filePath = path.join(__dirname, '../../data/fixtures/util/matman.config.js');
      expect(requireSync(filePath)).to.eql({
        rootPath: path.dirname(filePath),
      });
    });
  });

  describe('check requireAsync(filePath)', function () {
    it('requireAsync(data/fixtures/util/matman.config.js) should return current', async function () {
      const filePath = path.join(__dirname, '../../data/fixtures/util/matman.config.js');
      const content = await requireAsync(filePath);

      expect(content).to.eql({
        rootPath: path.dirname(filePath),
        default: {
          rootPath:
            '/Users/helinjiang/gitprojects/matman/packages/matman-core/test/data/fixtures/util',
        },
      });
    });
  });
});
