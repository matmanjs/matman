import 'mocha';
import {expect} from 'chai';

import {
  getNewFilePathWithTag,
  getFolderNameFromPath,
  getSaveDirFromPath,
} from '../../../src/util/path';

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

  describe('check getFolderNameFromPath(targetPath)', function () {
    it('a/b/c.min.js -> a_b_c_min_js', function () {
      expect(getFolderNameFromPath('a/b/c.min.js')).to.equal('a_b_c_min_js');
    });

    it('./a/b/c.min.js -> a_b_c_min_js', function () {
      expect(getFolderNameFromPath('./a/b/c.min.js')).to.equal('a_b_c_min_js');
    });

    it('../a/b/c.min.js -> parent_a_b_c_min_js', function () {
      expect(getFolderNameFromPath('../a/b/c.min.js')).to.equal('parent_a_b_c_min_js');
    });

    it('../../a/b/c.min.js -> parent_parent_a_b_c_min_js', function () {
      expect(getFolderNameFromPath('../../a/b/c.min.js')).to.equal('parent_parent_a_b_c_min_js');
    });

    it('/root/a/b/c.min.js -> root_root_a_b_c_min_js', function () {
      expect(getFolderNameFromPath('/root/a/b/c.min.js')).to.equal('root_root_a_b_c_min_js');
    });

    it('c.min.js -> c_min_js', function () {
      expect(getFolderNameFromPath('c.min.js')).to.equal('c_min_js');
    });

    it('iamfile -> iamfile', function () {
      expect(getFolderNameFromPath('iamfile')).to.equal('iamfile');
    });

    it('a\\b\\c.min.js -> a_b_c_min_js', function () {
      expect(getFolderNameFromPath('a\\b\\c.min.js')).to.equal('a_b_c_min_js');
    });

    it('.\\a\\b\\c.min.js -> a_b_c_min_js', function () {
      expect(getFolderNameFromPath('.\\a\\b\\c.min.js')).to.equal('a_b_c_min_js');
    });

    it('..\\a\\b\\c.min.js -> parent_a_b_c_min_js', function () {
      expect(getFolderNameFromPath('..\\a\\b\\c.min.js')).to.equal('parent_a_b_c_min_js');
    });

    it('..\\..\\a\\b\\c.min.js -> parent_parent_a_b_c_min_js', function () {
      expect(getFolderNameFromPath('..\\..\\a\\b\\c.min.js')).to.equal(
        'parent_parent_a_b_c_min_js',
      );
    });

    it('D:\\root\\a\\b\\c.min.js -> D_root_a_b_c_min_js', function () {
      expect(getFolderNameFromPath('D:\\root\\a\\b\\c.min.js')).to.equal('D_root_a_b_c_min_js');
    });
  });

  describe('check getSaveDirFromPath(targetPath)', function () {
    it('a/b/c.min.js -> a/b/c.min.js', function () {
      expect(getSaveDirFromPath('a/b/c.min.js')).to.equal('a/b/c_min_js');
    });

    it('./a/b/c.min.js -> a_b_c_min_js', function () {
      expect(getSaveDirFromPath('./a/b/c.min.js')).to.equal('a/b/c_min_js');
    });

    it('../a/b/c.min.js -> parent_a_b_c_min_js', function () {
      expect(getSaveDirFromPath('../a/b/c.min.js')).to.equal('parent/a/b/c_min_js');
    });

    it('../../a/b/c.min.js -> parent_parent_a_b_c_min_js', function () {
      expect(getSaveDirFromPath('../../a/b/c.min.js')).to.equal('parent/parent/a/b/c_min_js');
    });

    it('/root/a/b/c.min.js -> root_root_a_b_c_min_js', function () {
      expect(getSaveDirFromPath('/root/a/b/c.min.js')).to.equal('root/root/a/b/c_min_js');
    });

    it('c.min.js -> c_min_js', function () {
      expect(getSaveDirFromPath('c.min.js')).to.equal('c_min_js');
    });

    it('iamfile -> iamfile', function () {
      expect(getSaveDirFromPath('iamfile')).to.equal('iamfile');
    });

    it('a\\b\\c.min.js -> a_b_c_min_js', function () {
      expect(getSaveDirFromPath('a\\b\\c.min.js')).to.equal('a\\b\\c_min_js');
    });

    it('.\\a\\b\\c.min.js -> a_b_c_min_js', function () {
      expect(getSaveDirFromPath('.\\a\\b\\c.min.js')).to.equal('a\\b\\c_min_js');
    });

    it('..\\a\\b\\c.min.js -> parent_a_b_c_min_js', function () {
      expect(getSaveDirFromPath('..\\a\\b\\c.min.js')).to.equal('parent\\a\\b\\c_min_js');
    });

    it('..\\..\\a\\b\\c.min.js -> parent_parent_a_b_c_min_js', function () {
      expect(getSaveDirFromPath('..\\..\\a\\b\\c.min.js')).to.equal(
        'parent\\parent\\a\\b\\c_min_js',
      );
    });

    it('D:\\root\\a\\b\\c.min.js -> D_root_a_b_c_min_js', function () {
      expect(getSaveDirFromPath('D:\\root\\a\\b\\c.min.js')).to.equal('D\\root\\a\\b\\c_min_js');
    });
  });
});
