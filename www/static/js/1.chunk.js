webpackJsonp([1],{

/***/ 1018:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	__webpack_require__(1019);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var Home = function Home() {
	  return _react2.default.createElement(
	    'div',
	    { className: 'home' },
	    _react2.default.createElement(
	      'h2',
	      null,
	      'Home'
	    ),
	    _react2.default.createElement(
	      'p',
	      null,
	      '\u6B22\u8FCE\u4F7F\u7528 ',
	      _react2.default.createElement(
	        'a',
	        { href: 'https://github.com/helinjiang/matman', target: '_blank' },
	        'matman'
	      ),
	      '\uFF0C\u6B22\u8FCE\u7ED9\u6211\u4EEC\u63D0 ',
	      _react2.default.createElement(
	        'a',
	        { href: 'https://github.com/helinjiang/matman/issues', target: '_blank' },
	        'Issues'
	      ),
	      '\uFF01'
	    )
	  );
	};
	
	exports.default = Home;

/***/ }),

/***/ 1019:
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(1020);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(959)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/less-loader/dist/index.js!./index.less", function() {
				var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/less-loader/dist/index.js!./index.less");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),

/***/ 1020:
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(958)();
	// imports
	
	
	// module
	exports.push([module.id, ".home h2 {\n  color: green;\n}\n", ""]);
	
	// exports


/***/ })

});
//# sourceMappingURL=1.chunk.js.map