import 'mocha';
import {expect} from 'chai';

import {getFolderNameFromPath, getNewFilePathWithTag, getSaveDirFromPath} from '../../../src/util';

describe('./util/index.js', () => {
  describe('check getNewFilePathWithTag(filePath, tag)', () => {
    it('linux: filePath is absolute and basePath is undefined', () => {
      expect(getNewFilePathWithTag('/home/i/am/absolute/myfile.png')).to.equal(
        '/home/i/am/absolute/myfile.png',
      );
    });

    it('linux: filePath is absolute and basePath is "mytag"', () => {
      expect(getNewFilePathWithTag('/home/i/am/absolute/myfile.png', 'mytag')).to.equal(
        '/home/i/am/absolute/myfile_mytag.png',
      );
    });

    it('linux: filePath is absolute without extname and basePath is "mytag"', () => {
      expect(getNewFilePathWithTag('/home/i/am/absolute/myfile', 'mytag')).to.equal(
        '/home/i/am/absolute/myfile_mytag',
      );
    });

    it('linux: filePath is relative and basePath is undefined', () => {
      expect(getNewFilePathWithTag('./i/am/relative/myfile.png')).to.equal(
        './i/am/relative/myfile.png',
      );
    });

    it('linux: filePath is relative and basePath is "mytag"', () => {
      expect(getNewFilePathWithTag('./i/am/relative/myfile.png', 'mytag')).to.equal(
        'i/am/relative/myfile_mytag.png',
      );
    });

    it('linux: filePath is relative without extname and basePath is "mytag"', () => {
      expect(getNewFilePathWithTag('./i/am/relative/myfile', 'mytag')).to.equal(
        'i/am/relative/myfile_mytag',
      );
    });

    it('windows: filePath is absolute and basePath is undefined', () => {
      expect(getNewFilePathWithTag('d:\\i\\am\\absolute\\myfile.png')).to.equal(
        'd:\\i\\am\\absolute\\myfile.png',
      );
    });

    it('windows: filePath is absolute and basePath is "mytag"', () => {
      expect(getNewFilePathWithTag('d:\\i\\am\\absolute\\myfile.png', 'mytag')).to.equal(
        'd:\\i\\am\\absolute\\myfile_mytag.png',
      );
    });

    it('windows: filePath is absolute without extname and basePath is "mytag"', () => {
      expect(getNewFilePathWithTag('d:\\i\\am\\absolute\\myfile', 'mytag')).to.equal(
        'd:\\i\\am\\absolute\\myfile_mytag',
      );
    });

    it('windows: filePath is relative and basePath is undefined', () => {
      expect(getNewFilePathWithTag('.\\i\\am\\relative\\myfile.png')).to.equal(
        '.\\i\\am\\relative\\myfile.png',
      );
    });

    it('windows: filePath is relative and basePath is "mytag"', () => {
      expect(getNewFilePathWithTag('.\\i\\am\\relative\\myfile.png', 'mytag')).to.equal(
        'i\\am\\relative\\myfile_mytag.png',
      );
    });

    it('windows: filePath is relative without extname and basePath is "mytag"', () => {
      expect(getNewFilePathWithTag('.\\i\\am\\relative\\myfile', 'mytag')).to.equal(
        'i\\am\\relative\\myfile_mytag',
      );
    });
  });

  describe('check getFolderNameFromPath(targetPath)', () => {
    it('linux: targetPath is absolute folder', () => {
      expect(getFolderNameFromPath('/home/i/am/absolute')).to.equal('root_home_i_am_absolute');
    });

    it('linux: targetPath is absolute file', () => {
      expect(getFolderNameFromPath('/home/i/am/absolute/myfile.png')).to.equal(
        'root_home_i_am_absolute_myfile_png',
      );
    });

    it('linux: targetPath is relative folder', () => {
      expect(getFolderNameFromPath('i/am/relative/path')).to.equal('i_am_relative_path');
    });

    it('linux: targetPath is relative folder with ./', () => {
      expect(getFolderNameFromPath('./i/am/relative/path')).to.equal('i_am_relative_path');
    });

    it('linux: targetPath is relative folder with ../', () => {
      expect(getFolderNameFromPath('../i/am/relative/path')).to.equal('parent_i_am_relative_path');
    });

    it('linux: targetPath is relative folder with ../../', () => {
      expect(getFolderNameFromPath('../../i/am/relative/path')).to.equal(
        'parent_parent_i_am_relative_path',
      );
    });

    it('linux: targetPath is fileName with extname', () => {
      expect(getFolderNameFromPath('myscript.js')).to.equal('myscript_js');
    });

    it('linux: targetPath is fileName with two extname', () => {
      expect(getFolderNameFromPath('my.script.js')).to.equal('my_script_js');
    });

    it('linux: targetPath is fileName without extname', () => {
      expect(getFolderNameFromPath('myscript')).to.equal('myscript');
    });

    it('windows: targetPath is absolute folder', () => {
      expect(getFolderNameFromPath('d:\\i\\am\\absolute')).to.equal('d_i_am_absolute');
    });

    it('windows: targetPath is relative folder', () => {
      expect(getFolderNameFromPath('i\\am\\relative\\path')).to.equal('i_am_relative_path');
    });

    it('windows: targetPath is relative folder with ./', () => {
      expect(getFolderNameFromPath('.\\i\\am\\relative\\path')).to.equal('i_am_relative_path');
    });

    it('windows: targetPath is relative folder with ../', () => {
      expect(getFolderNameFromPath('..\\i\\am\\relative\\path')).to.equal(
        'parent_i_am_relative_path',
      );
    });

    it('windows: targetPath is relative folder with ../../', () => {
      expect(getFolderNameFromPath('..\\..\\i\\am\\relative\\path')).to.equal(
        'parent_parent_i_am_relative_path',
      );
    });
  });

  describe('check getSaveDirFromPath(targetPath)', () => {
    it('linux: targetPath is absolute folder', () => {
      expect(getSaveDirFromPath('/home/i/am/absolute')).to.equal('root/home/i/am/absolute');
    });

    it('linux: targetPath is absolute file', () => {
      expect(getSaveDirFromPath('/home/i/am/absolute/myfile.png')).to.equal(
        'root/home/i/am/absolute/myfile_png',
      );
    });

    it('linux: targetPath is relative folder', () => {
      expect(getSaveDirFromPath('i/am/relative/path')).to.equal('i/am/relative/path');
    });

    it('linux: targetPath is relative folder with ./', () => {
      expect(getSaveDirFromPath('./i/am/relative/path')).to.equal('i/am/relative/path');
    });

    it('linux: targetPath is relative folder with ../', () => {
      expect(getSaveDirFromPath('../i/am/relative/path')).to.equal('parent/i/am/relative/path');
    });

    it('linux: targetPath is relative folder with ../../', () => {
      expect(getSaveDirFromPath('../../i/am/relative/path')).to.equal(
        'parent/parent/i/am/relative/path',
      );
    });

    it('linux: targetPath is fileName with extname', () => {
      expect(getSaveDirFromPath('myscript.js')).to.equal('myscript_js');
    });

    it('linux: targetPath is fileName with two extname', () => {
      expect(getSaveDirFromPath('my.script.js')).to.equal('my_script_js');
    });

    it('linux: targetPath is fileName without extname', () => {
      expect(getSaveDirFromPath('myscript')).to.equal('myscript');
    });

    it('windows: targetPath is absolute folder', () => {
      expect(getSaveDirFromPath('d:\\i\\am\\absolute')).to.equal('d\\i\\am\\absolute');
    });

    it('windows: targetPath is relative folder', () => {
      expect(getSaveDirFromPath('i\\am\\relative\\path')).to.equal('i\\am\\relative\\path');
    });

    it('windows: targetPath is relative folder with ./', () => {
      expect(getSaveDirFromPath('.\\i\\am\\relative\\path')).to.equal('i\\am\\relative\\path');
    });

    it('windows: targetPath is relative folder with ../', () => {
      expect(getSaveDirFromPath('..\\i\\am\\relative\\path')).to.equal(
        'parent\\i\\am\\relative\\path',
      );
    });

    it('windows: targetPath is relative folder with ../../', () => {
      expect(getSaveDirFromPath('..\\..\\i\\am\\relative\\path')).to.equal(
        'parent\\parent\\i\\am\\relative\\path',
      );
    });
  });
});
