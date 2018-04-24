'use strict';

exports.__esModule = true;
exports.handleModules = exports.name = exports.config = exports.PATH = exports.isSerialized = undefined;

var _config2 = require('./config');

var _config3 = _interopRequireDefault(_config2);

var _config4 = require('./handle_modules/error_not_login/config.json');

var _config5 = _interopRequireDefault(_config4);

var _error_not_login = require('./handle_modules/error_not_login');

var _error_not_login2 = _interopRequireDefault(_error_not_login);

var _config6 = require('./handle_modules/success_depend_on_request/config.json');

var _config7 = _interopRequireDefault(_config6);

var _success_depend_on_request = require('./handle_modules/success_depend_on_request');

var _success_depend_on_request2 = _interopRequireDefault(_success_depend_on_request);

var _config8 = require('./handle_modules/success_type_0/config.json');

var _config9 = _interopRequireDefault(_config8);

var _success_type_ = require('./handle_modules/success_type_0');

var _success_type_2 = _interopRequireDefault(_success_type_);

var _config10 = require('./handle_modules/success_type_0_delay_2000/config.json');

var _config11 = _interopRequireDefault(_config10);

var _success_type_0_delay_ = require('./handle_modules/success_type_0_delay_2000');

var _success_type_0_delay_2 = _interopRequireDefault(_success_type_0_delay_);

var _config12 = require('./handle_modules/success_type_1/config.json');

var _config13 = _interopRequireDefault(_config12);

var _success_type_3 = require('./handle_modules/success_type_1');

var _success_type_4 = _interopRequireDefault(_success_type_3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isSerialized = exports.isSerialized = true;
var PATH = exports.PATH = __dirname;
exports.config = _config3.default;
var name = exports.name = _config3.default.name || 'user_info';
var handleModules = exports.handleModules = [{ name: 'error_not_login', module: _error_not_login2.default, config: _config5.default }, { name: 'success_depend_on_request', module: _success_depend_on_request2.default, config: _config7.default }, { name: 'success_type_0', module: _success_type_2.default, config: _config9.default }, { name: 'success_type_0_delay_2000', module: _success_type_0_delay_2.default, config: _config11.default }, { name: 'success_type_1', module: _success_type_4.default, config: _config13.default }];