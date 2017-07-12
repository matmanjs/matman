'use strict';

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ = require('lodash');

function validateKey(key) {
  if (key.indexOf('/') !== -1) {
    var msg = ['Oops, found / character in database property \'' + key + '\'.', '', '/ aren\'t supported, if you want to tweak default routes, see', 'https://github.com/typicode/json-server/#add-custom-routes'].join('\n');
    throw new Error(msg);
  }
}

module.exports = function (obj) {
  if (_.isPlainObject(obj)) {
    (0, _keys2.default)(obj).forEach(validateKey);
  } else {
    throw new Error('Data must be an object. Found ' + (typeof obj === 'undefined' ? 'undefined' : (0, _typeof3.default)(obj)) + '.' + 'See https://github.com/typicode/json-server for example.');
  }
};
//# sourceMappingURL=validate-data.js.map