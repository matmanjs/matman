import path from 'path';
import 'mocha';
import {expect} from 'chai';

import ScreenshotConfig from '../../../src/config/ScreenshotConfig';
import {findMatmanConfig} from '../../../src/util';
import MatmanConfig from '../../../src/config/MatmanConfig';

describe('check config/ScreenshotConfig.js', () => {
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
      expect(new ScreenshotConfig(matmanConfig, true, caseModuleFilePath)).to.eql({
        path: path.join(
          matmanConfig.screenshotPath,
          './page_baidu_index/basic-check_js/basic-check_js.png',
        ),
        tag: undefined,
      });
    });

    it('if opts is Boolean and tag is "mytag"', () => {
      expect(new ScreenshotConfig(matmanConfig, true, caseModuleFilePath, 'mytag')).to.eql({
        path: path.join(
          matmanConfig.screenshotPath,
          './page_baidu_index/basic-check_js/basic-check_js_mytag.png',
        ),
        tag: 'mytag',
      });
    });

    it('if opts is String(relative path) and tag is undefined', () => {
      expect(
        new ScreenshotConfig(matmanConfig, './is/relative/file.png', caseModuleFilePath),
      ).to.eql({
        path: path.join(matmanConfig.screenshotPath, './is/relative/file.png'),
        tag: undefined,
      });
    });

    it('if opts is String(relative path) and tag is "mytag"', () => {
      expect(
        new ScreenshotConfig(matmanConfig, './is/relative/file.png', caseModuleFilePath, 'mytag'),
      ).to.eql({
        path: path.join(matmanConfig.screenshotPath, './is/relative/file_mytag.png'),
        tag: 'mytag',
      });
    });

    it('if opts is String(absolute path) and tag is undefined', () => {
      expect(
        new ScreenshotConfig(matmanConfig, '/is/absolute/file.png', caseModuleFilePath),
      ).to.eql({
        path: '/is/absolute/file.png',
        tag: undefined,
      });
    });

    it('if opts is String(absolute path) and tag is "mytag"', () => {
      expect(
        new ScreenshotConfig(matmanConfig, '/is/absolute/file.png', caseModuleFilePath, 'mytag'),
      ).to.eql({
        path: '/is/absolute/file_mytag.png',
        tag: 'mytag',
      });
    });

    it('if opts is Object(relative path) and tag is undefined', () => {
      expect(
        new ScreenshotConfig(matmanConfig, {path: './is/relative/file.png'}, caseModuleFilePath),
      ).to.eql({
        path: path.join(matmanConfig.screenshotPath, './is/relative/file.png'),
        clip: undefined,
        tag: undefined,
      });
    });

    it('if opts is Object(relative path) and tag is "mytag"', () => {
      expect(
        new ScreenshotConfig(
          matmanConfig,
          {path: './is/relative/file.png'},
          caseModuleFilePath,
          'mytag',
        ),
      ).to.eql({
        path: path.join(matmanConfig.screenshotPath, './is/relative/file_mytag.png'),
        clip: undefined,
        tag: 'mytag',
      });
    });

    it('if opts is Object(relative path, clip) and tag is undefined', () => {
      expect(
        new ScreenshotConfig(
          matmanConfig,
          {
            path: './is/relative/file.png',
            clip: {x: 1, y: 2, width: 3, height: 4},
          },
          caseModuleFilePath,
        ),
      ).to.eql({
        path: path.join(matmanConfig.screenshotPath, './is/relative/file.png'),
        clip: {x: 1, y: 2, width: 3, height: 4},
        tag: undefined,
      });
    });

    it('if opts is Object(relative path, clip, tag) and tag is undefined', () => {
      expect(
        new ScreenshotConfig(
          matmanConfig,
          {
            path: './is/relative/file.png',
            clip: {x: 1, y: 2, width: 3, height: 4},
            tag: 'customtag',
          },
          caseModuleFilePath,
        ),
      ).to.eql({
        path: path.join(matmanConfig.screenshotPath, './is/relative/file_customtag.png'),
        clip: {x: 1, y: 2, width: 3, height: 4},
        tag: 'customtag',
      });
    });

    it('if opts is Object(relative path, clip, tag) and tag is "mytag"', () => {
      expect(
        new ScreenshotConfig(
          matmanConfig,
          {
            path: './is/relative/file.png',
            clip: {x: 1, y: 2, width: 3, height: 4},
            tag: 'customtag',
          },
          caseModuleFilePath,
          'mytag',
        ),
      ).to.eql({
        path: path.join(matmanConfig.screenshotPath, './is/relative/file_customtag.png'),
        clip: {x: 1, y: 2, width: 3, height: 4},
        tag: 'customtag',
      });
    });

    it('if opts is Object(absolute path) and tag is undefined', () => {
      expect(
        new ScreenshotConfig(matmanConfig, {path: '/is/absolute/file.png'}, caseModuleFilePath),
      ).to.eql({
        path: '/is/absolute/file.png',
        clip: undefined,
        tag: undefined,
      });
    });

    it('if opts is Object(absolute path) and tag is "mytag"', () => {
      expect(
        new ScreenshotConfig(
          matmanConfig,
          {path: '/is/absolute/file.png'},
          caseModuleFilePath,
          'mytag',
        ),
      ).to.eql({
        path: '/is/absolute/file_mytag.png',
        clip: undefined,
        tag: 'mytag',
      });
    });

    it('if opts is Object(absolute path, clip) and tag is undefined', () => {
      expect(
        new ScreenshotConfig(
          matmanConfig,
          {
            path: '/is/absolute/file.png',
            clip: {x: 1, y: 2, width: 3, height: 4},
          },
          caseModuleFilePath,
        ),
      ).to.eql({
        path: '/is/absolute/file.png',
        clip: {x: 1, y: 2, width: 3, height: 4},
        tag: undefined,
      });
    });

    it('if opts is Object(absolute path, clip, tag) and tag is undefined', () => {
      expect(
        new ScreenshotConfig(
          matmanConfig,
          {
            path: '/is/absolute/file.png',
            clip: {x: 1, y: 2, width: 3, height: 4},
            tag: 'customtag',
          },
          caseModuleFilePath,
        ),
      ).to.eql({
        path: '/is/absolute/file_customtag.png',
        clip: {x: 1, y: 2, width: 3, height: 4},
        tag: 'customtag',
      });
    });

    it('if opts is Object(absolute path, clip, tag) and tag is "mytag"', () => {
      expect(
        new ScreenshotConfig(
          matmanConfig,
          {
            path: '/is/absolute/file.png',
            clip: {x: 1, y: 2, width: 3, height: 4},
            tag: 'customtag',
          },
          caseModuleFilePath,
          'mytag',
        ),
      ).to.eql({
        path: '/is/absolute/file_customtag.png',
        clip: {x: 1, y: 2, width: 3, height: 4},
        tag: 'customtag',
      });
    });
  });

  describe('check getPathWithId(id)', () => {
    const MATMAN_ROOT_PATH = path.join(__dirname, '../../data/fixtures/demo_sample');
    const caseModuleFilePath = path.join(
      MATMAN_ROOT_PATH,
      './case_modules/page_baidu_index/basic-check.js',
    );
    const matmanConfig = findMatmanConfig(caseModuleFilePath, {
      rootPath: MATMAN_ROOT_PATH,
    }) as MatmanConfig;

    it('if opts is Boolean and tag is "mytag"', () => {
      expect(
        new ScreenshotConfig(matmanConfig, true, caseModuleFilePath, 'mytag').getPathWithId(1024),
      ).to.equal(
        path.join(
          matmanConfig.screenshotPath,
          './page_baidu_index/basic-check_js/basic-check_js_mytag_1024.png',
        ),
      );
    });

    it('if opts is String(relative path) and tag is "mytag"', () => {
      expect(
        new ScreenshotConfig(
          matmanConfig,
          './is/relative/file.png',
          caseModuleFilePath,
          'mytag',
        ).getPathWithId(1024),
      ).to.equal(path.join(matmanConfig.screenshotPath, './is/relative/file_mytag_1024.png'));
    });

    it('if opts is String(absolute path) and tag is "mytag"', () => {
      expect(
        new ScreenshotConfig(
          matmanConfig,
          '/is/absolute/file.png',
          caseModuleFilePath,
          'mytag',
        ).getPathWithId(1024),
      ).to.equal('/is/absolute/file_mytag_1024.png');
    });

    it('if opts is Object(relative path, clip, tag) and tag is "mytag"', () => {
      expect(
        new ScreenshotConfig(
          matmanConfig,
          {
            path: './is/relative/file.png',
            clip: {x: 1, y: 2, width: 3, height: 4},
            tag: 'customtag',
          },
          caseModuleFilePath,
          'mytag',
        ).getPathWithId(1024),
      ).to.equal(path.join(matmanConfig.screenshotPath, './is/relative/file_customtag_1024.png'));
    });

    it('if opts is Object(absolute path, clip, tag) and tag is "mytag"', () => {
      expect(
        new ScreenshotConfig(
          matmanConfig,
          {
            path: '/is/absolute/file.png',
            clip: {x: 1, y: 2, width: 3, height: 4},
            tag: 'customtag',
          },
          caseModuleFilePath,
          'mytag',
        ).getPathWithId(1024),
      ).to.equal('/is/absolute/file_customtag_1024.png');
    });
  });
});
