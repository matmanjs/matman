'use strict';

exports.__esModule = true;
exports.handleModules = exports.name = exports.config = exports.PATH = exports.isSerialized = undefined;

var _config2 = require('./config');

var _config3 = _interopRequireDefault(_config2);

var _error = require('./handle_modules/error');

var _error2 = _interopRequireDefault(_error);

var _success = require('./handle_modules/success');

var _success2 = _interopRequireDefault(_success);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isSerialized = exports.isSerialized = true;
var PATH = exports.PATH = __dirname;
exports.config = _config3.default;
var name = exports.name = _config3.default.name || 'demo_plugin_stub';
var handleModules = exports.handleModules = [{ name: 'error', module: _error2.default, config: null }, { name: 'success', module: _success2.default, config: null }];