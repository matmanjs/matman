import path from 'path';
import 'mocha';
import {expect} from 'chai';
import fse from 'fs-extra';

import build from '../../../src/run-build/build';

describe('check run-build/build.ts', () => {
  it('build demo_for_crawlers/case_modules/crawlers/c1.js', async () => {
    const entryPath = path.join(
      __dirname,
      '../../data/fixtures/demo_for_crawlers/case_modules/crawlers/c1.js',
    );
    const outputPath = path.join(__dirname, '../../data/expects/build-result/c1.js.result');
    return build(entryPath).then(result => {
      expect(result).to.equal(fse.readFileSync(outputPath, {encoding: 'utf8'}));
    });
  });
});
