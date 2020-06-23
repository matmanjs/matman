import path from 'path';
import 'mocha';
import {expect} from 'chai';

import MatmanResultConfig from '../../../src/config/MatmanResultConfig';
import {findMatmanConfig} from '../../../src/util';
import MatmanConfig from '../../../src/config/MatmanConfig';

describe('check config/MatmanResultConfig.js', () => {
  describe('check constructor(opts, basePath, tag)', () => {
    const MATMAN_ROOT_PATH = path.join(__dirname, '../../data/fixtures/demo_sample');
    const caseModuleFilePath = path.join(
      MATMAN_ROOT_PATH,
      './case_modules/page_baidu_index/basic-check.js',
    );
    const matmanConfig = findMatmanConfig(caseModuleFilePath, {
      rootPath: MATMAN_ROOT_PATH,
    }) as MatmanConfig;

    it('if opts is Boolean and tag is undefined', () => {
      expect(new MatmanResultConfig(matmanConfig, true, caseModuleFilePath)).to.eql({
        path: path.join(matmanConfig.matmanResultPath, './page_baidu_index/basic-check_js.json'),
        tag: undefined,
      });
    });

    it('if opts is Boolean and tag is "mytag"', () => {
      expect(new MatmanResultConfig(matmanConfig, true, caseModuleFilePath, 'mytag')).to.eql({
        path: path.join(
          matmanConfig.matmanResultPath,
          './page_baidu_index/basic-check_js_mytag.json',
        ),
        tag: 'mytag',
      });
    });

    it('if opts is String(relative path) and tag is undefined', () => {
      expect(
        new MatmanResultConfig(matmanConfig, './is/relative/file.json', caseModuleFilePath),
      ).to.eql({
        path: path.join(matmanConfig.matmanResultPath, './is/relative/file.json'),
        tag: undefined,
      });
    });

    it('if opts is String(relative path) and tag is "mytag"', () => {
      expect(
        new MatmanResultConfig(
          matmanConfig,
          './is/relative/file.json',
          caseModuleFilePath,
          'mytag',
        ),
      ).to.eql({
        path: path.join(matmanConfig.matmanResultPath, './is/relative/file_mytag.json'),
        tag: 'mytag',
      });
    });

    it('if opts is String(absolute path) and tag is undefined', () => {
      expect(
        new MatmanResultConfig(matmanConfig, '/is/absolute/file.json', caseModuleFilePath),
      ).to.eql({
        path: '/is/absolute/file.json',
        tag: undefined,
      });
    });

    it('if opts is String(absolute path) and tag is "mytag"', () => {
      expect(
        new MatmanResultConfig(matmanConfig, '/is/absolute/file.json', caseModuleFilePath, 'mytag'),
      ).to.eql({
        path: '/is/absolute/file_mytag.json',
        tag: 'mytag',
      });
    });

    it('if opts is Object(relative path) and tag is undefined', () => {
      expect(
        new MatmanResultConfig(matmanConfig, {path: './is/relative/file.json'}, caseModuleFilePath),
      ).to.eql({
        path: path.join(matmanConfig.matmanResultPath, './is/relative/file.json'),
        tag: undefined,
      });
    });

    it('if opts is Object(relative path) and tag is "mytag"', () => {
      expect(
        new MatmanResultConfig(
          matmanConfig,
          {path: './is/relative/file.json'},
          caseModuleFilePath,
          'mytag',
        ),
      ).to.eql({
        path: path.join(matmanConfig.matmanResultPath, './is/relative/file_mytag.json'),
        tag: 'mytag',
      });
    });

    it('if opts is Object(absolute path) and tag is undefined', () => {
      expect(
        new MatmanResultConfig(matmanConfig, {path: '/is/absolute/file.json'}, caseModuleFilePath),
      ).to.eql({
        path: '/is/absolute/file.json',
        tag: undefined,
      });
    });

    it('if opts is Object(absolute path) and tag is "mytag"', () => {
      expect(
        new MatmanResultConfig(
          matmanConfig,
          {path: '/is/absolute/file.json'},
          caseModuleFilePath,
          'mytag',
        ),
      ).to.eql({
        path: '/is/absolute/file_mytag.json',
        tag: 'mytag',
      });
    });

    it('if opts is Object(absolute path and tag="hightag") and tag is "mytag"', () => {
      expect(
        new MatmanResultConfig(
          matmanConfig,
          {path: '/is/absolute/file.json', tag: 'hightag'},
          caseModuleFilePath,
          'mytag',
        ),
      ).to.eql({
        path: '/is/absolute/file_hightag.json',
        tag: 'hightag',
      });
    });
  });
});
