const fs = require('fs');
const walkSync = require('walk-sync');

/**
 * 获得某路径下所有的文件和文件夹。
 *
 * https://www.npmjs.com/package/walk-sync
 *
 * @param {String} paths 路径
 * @param {Object} [options] 额外选项
 * @param {Array} [options.globs] An array of globs. Only files and directories that match at least one of the provided globs will be returned.
 * @param {Boolean} [options.directories ]  (default: true): Pass false to only return files, not directories
 * @param {Array} [options.ignore] An array of globs. Files and directories that match at least one of the provided globs will be pruned while searching.
 *
 * @return {Array} 结果，每个数组的元素为FileItem。
 */
function getAll(paths, options) {
  var result = [];

  var entry = walkSync.entries(paths, options);

  entry.forEach(function (item) {
    // result.push(new FileItem(item.basePath, item.relativePath, item.mode, item.size, item.mtime, item.isDirectory()));
    result.push(item);
  });

  return result;
}

function getAllFiles(paths) {
  return getAll(paths, { directories: false });
}

function isDirectory(paths) {
  return fs.lstatSync(paths).isDirectory();
}

function isFile(paths) {
  return fs.lstatSync(paths).isFile();
}

module.exports = {
  getAll: getAll,
  getAllFiles: getAllFiles,
  isDirectory: isDirectory,
  isFile: isFile,
};