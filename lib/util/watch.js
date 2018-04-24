'use strict';

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NodeWatchFileSystem = require('./NodeWatchFileSystem');

/**
 * 监听文件及文件夹变化
 * @param {Array} files 监听的文件列表数组
 * @param {Array} dirs 监听的文件夹列表数组
 * @param {Array} missing 不监听的文件列表
 * @param {Object} [options] 额外参数
 * @param {Function} callback 回调
 */
function watch(files, dirs, missing) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var callback = arguments[4];

  var startTime = new Date().getTime();
  var wfs = new NodeWatchFileSystem();

  // 合并选项
  options = (0, _assign2.default)({
    // Delay the rebuilt after the first change. Value is a time in ms.
    aggregateTimeout: 1000
  }, options);

  var watcherCallback = function watcherCallback(err, filesModified, dirsModified, missingCreated, fileTimestamps, dirTimestamps) {
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

  var watcher = wfs.watch(files, dirs, missing, startTime, options, watcherCallback);
}

module.exports = watch;
//# sourceMappingURL=watch.js.map