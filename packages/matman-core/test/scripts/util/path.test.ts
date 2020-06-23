import 'mocha';
import {expect} from 'chai';

import {getNewFilePathWithTag} from '../../../src/util/path';

describe('./util/path.ts', function () {
  describe('check getNewFilePathWithTag(filePath, tag)', function () {
    it('if tag is undefined then return filePath direct', function () {
      expect(getNewFilePathWithTag('./a/b/c.min.js')).to.equal('./a/b/c.min.js');
    });

    it('a/b/c.min.js + iamtag -> a/b/c.min_iamtag.js', function () {
      expect(getNewFilePathWithTag('a/b/c.min.js', 'iamtag')).to.equal('a/b/c.min_iamtag.js');
    });

    it('./a/b/c.min.js + iamtag -> a/b/c.min_iamtag.js', function () {
      expect(getNewFilePathWithTag('./a/b/c.min.js', 'iamtag')).to.equal('a/b/c.min_iamtag.js');
    });

    it('../a/b/c.min.js + iamtag -> ../a/b/c.min_iamtag.js', function () {
      expect(getNewFilePathWithTag('../a/b/c.min.js', 'iamtag')).to.equal('../a/b/c.min_iamtag.js');
    });

    it('/root/a/b/c.min.js + iamtag -> /root/a/b/c.min_iamtag.js', function () {
      expect(getNewFilePathWithTag('/root/a/b/c.min.js', 'iamtag')).to.equal(
        '/root/a/b/c.min_iamtag.js',
      );
    });

    it('c.min.js + iamtag -> c.min_iamtag.js', function () {
      expect(getNewFilePathWithTag('c.min.js', 'iamtag')).to.equal('c.min_iamtag.js');
    });

    it('iamfile + iamtag -> iamfile_iamtag', function () {
      expect(getNewFilePathWithTag('iamfile', 'iamtag')).to.equal('iamfile_iamtag');
    });

    it('a\\b\\c.min.js + iamtag -> a\\b\\c.min_iamtag.js', function () {
      expect(getNewFilePathWithTag('a\\b\\c.min.js', 'iamtag')).to.equal('a\\b\\c.min_iamtag.js');
    });

    it('.\\a\\b\\c.min.js + iamtag -> a\\b\\c.min_iamtag.js', function () {
      expect(getNewFilePathWithTag('.\\a\\b\\c.min.js', 'iamtag')).to.equal(
        'a\\b\\c.min_iamtag.js',
      );
    });

    it('..\\a\\b\\c.min.js + iamtag -> ..\\a\\b\\c.min_iamtag.js', function () {
      expect(getNewFilePathWithTag('..\\a\\b\\c.min.js', 'iamtag')).to.equal(
        '..\\a\\b\\c.min_iamtag.js',
      );
    });

    it('D:\\root\\a\\b\\c.min.js + iamtag -> D:\\root\\a\\b\\c.min_iamtag.js', function () {
      expect(getNewFilePathWithTag('D:\\root\\a\\b\\c.min.js', 'iamtag')).to.equal(
        'D:\\root\\a\\b\\c.min_iamtag.js',
      );
    });
  });
});
