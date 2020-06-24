import path from 'path';
import 'mocha';
import {expect} from 'chai';
import fse from 'fs-extra';

import build from '../../../src/run-build/build';

describe('check run-build/build.ts', () => {
  it('build simple file', () => {
    const entryPath = path.join(
      __dirname,
      '../../data/fixtures/demo_for_crawlers/case_modules/crawlers/simple-file.js',
    );
    const outputPath = path.join(
      __dirname,
      '../../data/expects/build-result/simple-file.js.result',
    );
    return build(entryPath).then(result => {
      expect(result).to.equal(fse.readFileSync(outputPath, {encoding: 'utf8'}));
    });
  });

  it('build file with require other js modules', () => {
    const entryPath = path.join(
      __dirname,
      '../../data/fixtures/demo_for_crawlers/case_modules/crawlers/file-require-js-module.js',
    );
    const outputPath = path.join(
      __dirname,
      '../../data/expects/build-result/file-require-js-module.js.result',
    );
    return build(entryPath).then(result => {
      expect(result).to.equal(fse.readFileSync(outputPath, {encoding: 'utf8'}));
    });
  });
});
