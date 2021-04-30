import 'mocha';
import { expect } from 'chai';

import {
  getNewFilePathWithTag,
  getFolderNameFromPath,
  getSaveDirFromPath,
} from '../../../src/util/path';

describe('./util/path.ts', () => {
  describe('check getNewFilePathWithTag(filePath, tag)', () => {
    it('if tag is undefined then return filePath direct', () => {
      expect(getNewFilePathWithTag('./a/b/c.min.js')).to.equal('./a/b/c.min.js');
    });

    it('a/b/c.min.js + iamtag -> a/b/c.min_iamtag.js', () => {
      expect(getNewFilePathWithTag('a/b/c.min.js', 'iamtag')).to.equal('a/b/c.min_iamtag.js');
    });

    it('./a/b/c.min.js + iamtag -> a/b/c.min_iamtag.js', () => {
      expect(getNewFilePathWithTag('./a/b/c.min.js', 'iamtag')).to.equal('a/b/c.min_iamtag.js');
    });

    it('../a/b/c.min.js + iamtag -> ../a/b/c.min_iamtag.js', () => {
      expect(getNewFilePathWithTag('../a/b/c.min.js', 'iamtag')).to.equal('../a/b/c.min_iamtag.js');
    });

    it('/root/a/b/c.min.js + iamtag -> /root/a/b/c.min_iamtag.js', () => {
      expect(getNewFilePathWithTag('/root/a/b/c.min.js', 'iamtag')).to.equal('/root/a/b/c.min_iamtag.js');
    });

    it('c.min.js + iamtag -> c.min_iamtag.js', () => {
      expect(getNewFilePathWithTag('c.min.js', 'iamtag')).to.equal('c.min_iamtag.js');
    });

    it('iamfile + iamtag -> iamfile_iamtag', () => {
      expect(getNewFilePathWithTag('iamfile', 'iamtag')).to.equal('iamfile_iamtag');
    });

    it('a\\b\\c.min.js + iamtag -> a\\b\\c.min_iamtag.js', () => {
      expect(getNewFilePathWithTag('a\\b\\c.min.js', 'iamtag')).to.equal('a\\b\\c.min_iamtag.js');
    });

    it('.\\a\\b\\c.min.js + iamtag -> a\\b\\c.min_iamtag.js', () => {
      expect(getNewFilePathWithTag('.\\a\\b\\c.min.js', 'iamtag')).to.equal('a\\b\\c.min_iamtag.js');
    });

    it('..\\a\\b\\c.min.js + iamtag -> ..\\a\\b\\c.min_iamtag.js', () => {
      expect(getNewFilePathWithTag('..\\a\\b\\c.min.js', 'iamtag')).to.equal('..\\a\\b\\c.min_iamtag.js');
    });

    it('D:\\root\\a\\b\\c.min.js + iamtag -> D:\\root\\a\\b\\c.min_iamtag.js', () => {
      expect(getNewFilePathWithTag('D:\\root\\a\\b\\c.min.js', 'iamtag')).to.equal('D:\\root\\a\\b\\c.min_iamtag.js');
    });
  });

  describe('check getFolderNameFromPath(targetPath)', () => {
    it('a/b/c.min.js -> a_b_c_min_js', () => {
      expect(getFolderNameFromPath('a/b/c.min.js')).to.equal('a_b_c_min_js');
    });

    it('./a/b/c.min.js -> a_b_c_min_js', () => {
      expect(getFolderNameFromPath('./a/b/c.min.js')).to.equal('a_b_c_min_js');
    });

    it('../a/b/c.min.js -> parent_a_b_c_min_js', () => {
      expect(getFolderNameFromPath('../a/b/c.min.js')).to.equal('parent_a_b_c_min_js');
    });

    it('../../a/b/c.min.js -> parent_parent_a_b_c_min_js', () => {
      expect(getFolderNameFromPath('../../a/b/c.min.js')).to.equal('parent_parent_a_b_c_min_js');
    });

    it('/root/a/b/c.min.js -> root_root_a_b_c_min_js', () => {
      expect(getFolderNameFromPath('/root/a/b/c.min.js')).to.equal('root_root_a_b_c_min_js');
    });

    it('c.min.js -> c_min_js', () => {
      expect(getFolderNameFromPath('c.min.js')).to.equal('c_min_js');
    });

    it('iamfile -> iamfile', () => {
      expect(getFolderNameFromPath('iamfile')).to.equal('iamfile');
    });

    it('a\\b\\c.min.js -> a_b_c_min_js', () => {
      expect(getFolderNameFromPath('a\\b\\c.min.js')).to.equal('a_b_c_min_js');
    });

    it('.\\a\\b\\c.min.js -> a_b_c_min_js', () => {
      expect(getFolderNameFromPath('.\\a\\b\\c.min.js')).to.equal('a_b_c_min_js');
    });

    it('..\\a\\b\\c.min.js -> parent_a_b_c_min_js', () => {
      expect(getFolderNameFromPath('..\\a\\b\\c.min.js')).to.equal('parent_a_b_c_min_js');
    });

    it('..\\..\\a\\b\\c.min.js -> parent_parent_a_b_c_min_js', () => {
      expect(getFolderNameFromPath('..\\..\\a\\b\\c.min.js')).to.equal('parent_parent_a_b_c_min_js');
    });

    it('D:\\root\\a\\b\\c.min.js -> D_root_a_b_c_min_js', () => {
      expect(getFolderNameFromPath('D:\\root\\a\\b\\c.min.js')).to.equal('D_root_a_b_c_min_js');
    });
  });

  describe('check getSaveDirFromPath(targetPath)', () => {
    it('a/b/c.min.js -> a/b/c.min.js', () => {
      expect(getSaveDirFromPath('a/b/c.min.js')).to.equal('a/b/c_min_js');
    });

    it('./a/b/c.min.js -> a_b_c_min_js', () => {
      expect(getSaveDirFromPath('./a/b/c.min.js')).to.equal('a/b/c_min_js');
    });

    it('../a/b/c.min.js -> parent_a_b_c_min_js', () => {
      expect(getSaveDirFromPath('../a/b/c.min.js')).to.equal('parent/a/b/c_min_js');
    });

    it('../../a/b/c.min.js -> parent_parent_a_b_c_min_js', () => {
      expect(getSaveDirFromPath('../../a/b/c.min.js')).to.equal('parent/parent/a/b/c_min_js');
    });

    it('/root/a/b/c.min.js -> root_root_a_b_c_min_js', () => {
      expect(getSaveDirFromPath('/root/a/b/c.min.js')).to.equal('root/root/a/b/c_min_js');
    });

    it('c.min.js -> c_min_js', () => {
      expect(getSaveDirFromPath('c.min.js')).to.equal('c_min_js');
    });

    it('iamfile -> iamfile', () => {
      expect(getSaveDirFromPath('iamfile')).to.equal('iamfile');
    });

    it('a\\b\\c.min.js -> a_b_c_min_js', () => {
      expect(getSaveDirFromPath('a\\b\\c.min.js')).to.equal('a\\b\\c_min_js');
    });

    it('.\\a\\b\\c.min.js -> a_b_c_min_js', () => {
      expect(getSaveDirFromPath('.\\a\\b\\c.min.js')).to.equal('a\\b\\c_min_js');
    });

    it('..\\a\\b\\c.min.js -> parent_a_b_c_min_js', () => {
      expect(getSaveDirFromPath('..\\a\\b\\c.min.js')).to.equal('parent\\a\\b\\c_min_js');
    });

    it('..\\..\\a\\b\\c.min.js -> parent_parent_a_b_c_min_js', () => {
      expect(getSaveDirFromPath('..\\..\\a\\b\\c.min.js')).to.equal('parent\\parent\\a\\b\\c_min_js');
    });

    it('D:\\root\\a\\b\\c.min.js -> D_root_a_b_c_min_js', () => {
      expect(getSaveDirFromPath('D:\\root\\a\\b\\c.min.js')).to.equal('D\\root\\a\\b\\c_min_js');
    });
  });
});
