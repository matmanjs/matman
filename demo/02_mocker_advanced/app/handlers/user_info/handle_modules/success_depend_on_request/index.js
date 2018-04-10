'use strict';

exports.__esModule = true;

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

exports.default = getResult;

var _base = require('../../base');

var _success_type_ = require('../success_type_0');

var _success_type_2 = _interopRequireDefault(_success_type_);

var _success_type_3 = require('../success_type_1');

var _success_type_4 = _interopRequireDefault(_success_type_3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getResult(params, req) {
  var data = params.type === '0' ? (0, _success_type_2.default)() : (0, _success_type_4.default)();

  return (0, _base.getSuccessData)((0, _assign2.default)({}, data.result, {
    uid: params.uid
  }));
}