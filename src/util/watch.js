const NodeWatchFileSystem = require('./NodeWatchFileSystem');

/**
 * 监听文件及文件夹变化
 * @param {Array} files 监听的文件列表数组
 * @param {Array} dirs 监听的文件夹列表数组
 * @param {Array} missing 不监听的文件列表
 * @param {Object} [options] 额外参数
 * @param {Function} callback 回调
 */
function watch(files, dirs, missing, options = {}, callback) {
  const startTime = new Date().getTime();
  const wfs = new NodeWatchFileSystem();

  // 合并选项
  options = Object.assign({
    // Delay the rebuilt after the first change. Value is a time in ms.
    aggregateTimeout: 1000
  }, options);

  const watcherCallback = function (err, filesModified, dirsModified, missingCreated, fileTimestamps, dirTimestamps) {
    if (options.debug) {
      console.log('[watch] change!', err, filesModified, dirsModified, missingCreated, fileTimestamps, dirTimestamps);
    }

    if (err) {
      throw err;
    }

    if (typeof callback === 'function') {
      callback(err, filesModified, dirsModified, missingCreated, fileTimestamps, dirTimestamps);
    }

    watcher.close();
  };

  const watcher = wfs.watch(files, dirs, missing, startTime, options, watcherCallback);
}

module.exports = watch;