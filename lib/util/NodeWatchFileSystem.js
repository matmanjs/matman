/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
'use strict';

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Watchpack = require('watchpack');

// const objectToMap = require("../util/objectToMap");

function objectToMap(obj) {
  return new _map2.default((0, _keys2.default)(obj).map(function (key) {
    return [key, obj[key]];
  }));
};

var NodeWatchFileSystem = function () {
  function NodeWatchFileSystem(inputFileSystem) {
    (0, _classCallCheck3.default)(this, NodeWatchFileSystem);

    this.inputFileSystem = inputFileSystem;
    this.watcherOptions = {
      aggregateTimeout: 0
    };
    this.watcher = new Watchpack(this.watcherOptions);
  }

  NodeWatchFileSystem.prototype.watch = function watch(files, dirs, missing, startTime, options, callback, callbackUndelayed) {
    var _this = this;

    if (!Array.isArray(files)) throw new Error('Invalid arguments: \'files\'');
    if (!Array.isArray(dirs)) throw new Error('Invalid arguments: \'dirs\'');
    if (!Array.isArray(missing)) throw new Error('Invalid arguments: \'missing\'');
    if (typeof callback !== 'function') throw new Error('Invalid arguments: \'callback\'');
    if (typeof startTime !== 'number' && startTime) throw new Error('Invalid arguments: \'startTime\'');
    if ((typeof options === 'undefined' ? 'undefined' : (0, _typeof3.default)(options)) !== 'object') throw new Error('Invalid arguments: \'options\'');
    if (typeof callbackUndelayed !== 'function' && callbackUndelayed) throw new Error('Invalid arguments: \'callbackUndelayed\'');
    var oldWatcher = this.watcher;
    this.watcher = new Watchpack(options);

    if (callbackUndelayed) this.watcher.once('change', callbackUndelayed);

    this.watcher.once('aggregated', function (changes, removals) {
      changes = changes.concat(removals);
      if (_this.inputFileSystem && _this.inputFileSystem.purge) {
        _this.inputFileSystem.purge(changes);
      }
      var times = objectToMap(_this.watcher.getTimes());
      callback(null, changes.filter(function (file) {
        return files.includes(file);
      }).sort(), changes.filter(function (file) {
        return dirs.includes(file);
      }).sort(), changes.filter(function (file) {
        return missing.includes(file);
      }).sort(), times, times);
    });

    this.watcher.watch(files.concat(missing), dirs.concat(missing), startTime);

    if (oldWatcher) {
      oldWatcher.close();
    }
    return {
      close: function close() {
        if (_this.watcher) {
          _this.watcher.close();
          _this.watcher = null;
        }
      },
      pause: function pause() {
        if (_this.watcher) {
          _this.watcher.pause();
        }
      },
      getFileTimestamps: function getFileTimestamps() {
        if (_this.watcher) return objectToMap(_this.watcher.getTimes());else return new _map2.default();
      },
      getContextTimestamps: function getContextTimestamps() {
        if (_this.watcher) return objectToMap(_this.watcher.getTimes());else return new _map2.default();
      }
    };
  };

  return NodeWatchFileSystem;
}();

module.exports = NodeWatchFileSystem;
//# sourceMappingURL=NodeWatchFileSystem.js.map