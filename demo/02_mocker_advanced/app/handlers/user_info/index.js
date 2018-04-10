'use strict';

exports.__esModule = true;
exports.handleModules = exports.name = exports.config = exports.PATH = exports.isSerialized = undefined;

var _config2 = require('./config');

var _config3 = _interopRequireDefault(_config2);

var _error = require('./handle_modules/error');

var _error2 = _interopRequireDefault(_error);

var _success_ = require('./handle_modules/success_1');

var _success_2 = _interopRequireDefault(_success_);

var _success_3 = require('./handle_modules/success_2');

var _success_4 = _interopRequireDefault(_success_3);

var _config4 = require('./handle_modules/success_3/config.json');

var _config5 = _interopRequireDefault(_config4);

var _success_5 = require('./handle_modules/success_3');

var _success_6 = _interopRequireDefault(_success_5);

var _config6 = require('./handle_modules/success_4/config.json');

var _config7 = _interopRequireDefault(_config6);

var _success_7 = require('./handle_modules/success_4');

var _success_8 = _interopRequireDefault(_success_7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isSerialized = exports.isSerialized = true;
var PATH = exports.PATH = __dirname;
exports.config = _config3.default;
var name = exports.name = 'user_info';
var handleModules = exports.handleModules = [{ name: 'error', module: _error2.default, config: null }, { name: 'success_1', module: _success_2.default, config: null }, { name: 'success_2', module: _success_4.default, config: null }, { name: 'success_3', module: _success_6.default, config: _config5.default }, { name: 'success_4', module: _success_8.default, config: _config7.default }];