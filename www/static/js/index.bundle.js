webpackJsonp([0],{

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(37);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _App = __webpack_require__(184);
	
	var _App2 = _interopRequireDefault(_App);
	
	__webpack_require__(233);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	_reactDom2.default.render(_react2.default.createElement(_App2.default, null), document.getElementById('root'));

/***/ }),

/***/ 184:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactRouterDom = __webpack_require__(185);
	
	var _home = __webpack_require__(225);
	
	var _home2 = _interopRequireDefault(_home);
	
	var _about = __webpack_require__(230);
	
	var _about2 = _interopRequireDefault(_about);
	
	var _topics = __webpack_require__(231);
	
	var _topics2 = _interopRequireDefault(_topics);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var BasicExample = function BasicExample() {
	    return _react2.default.createElement(
	        _reactRouterDom.BrowserRouter,
	        null,
	        _react2.default.createElement(
	            'div',
	            null,
	            _react2.default.createElement(
	                'ul',
	                null,
	                _react2.default.createElement(
	                    'li',
	                    null,
	                    _react2.default.createElement(
	                        _reactRouterDom.Link,
	                        { to: '/' },
	                        'Home'
	                    )
	                ),
	                _react2.default.createElement(
	                    'li',
	                    null,
	                    _react2.default.createElement(
	                        _reactRouterDom.Link,
	                        { to: '/about' },
	                        'About'
	                    )
	                ),
	                _react2.default.createElement(
	                    'li',
	                    null,
	                    _react2.default.createElement(
	                        _reactRouterDom.Link,
	                        { to: '/topics' },
	                        'Topics'
	                    )
	                )
	            ),
	            _react2.default.createElement('hr', null),
	            _react2.default.createElement(_reactRouterDom.Route, { exact: true, path: '/', component: _home2.default }),
	            _react2.default.createElement(_reactRouterDom.Route, { path: '/about', component: _about2.default }),
	            _react2.default.createElement(_reactRouterDom.Route, { path: '/topics', component: _topics2.default })
	        )
	    );
	};
	
	exports.default = BasicExample;

/***/ }),

/***/ 185:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports.withRouter = exports.matchPath = exports.Switch = exports.StaticRouter = exports.Router = exports.Route = exports.Redirect = exports.Prompt = exports.NavLink = exports.MemoryRouter = exports.Link = exports.HashRouter = exports.BrowserRouter = undefined;
	
	var _BrowserRouter2 = __webpack_require__(186);
	
	var _BrowserRouter3 = _interopRequireDefault(_BrowserRouter2);
	
	var _HashRouter2 = __webpack_require__(212);
	
	var _HashRouter3 = _interopRequireDefault(_HashRouter2);
	
	var _Link2 = __webpack_require__(214);
	
	var _Link3 = _interopRequireDefault(_Link2);
	
	var _MemoryRouter2 = __webpack_require__(215);
	
	var _MemoryRouter3 = _interopRequireDefault(_MemoryRouter2);
	
	var _NavLink2 = __webpack_require__(216);
	
	var _NavLink3 = _interopRequireDefault(_NavLink2);
	
	var _Prompt2 = __webpack_require__(217);
	
	var _Prompt3 = _interopRequireDefault(_Prompt2);
	
	var _Redirect2 = __webpack_require__(218);
	
	var _Redirect3 = _interopRequireDefault(_Redirect2);
	
	var _Route2 = __webpack_require__(219);
	
	var _Route3 = _interopRequireDefault(_Route2);
	
	var _Router2 = __webpack_require__(220);
	
	var _Router3 = _interopRequireDefault(_Router2);
	
	var _StaticRouter2 = __webpack_require__(221);
	
	var _StaticRouter3 = _interopRequireDefault(_StaticRouter2);
	
	var _Switch2 = __webpack_require__(222);
	
	var _Switch3 = _interopRequireDefault(_Switch2);
	
	var _matchPath2 = __webpack_require__(223);
	
	var _matchPath3 = _interopRequireDefault(_matchPath2);
	
	var _withRouter2 = __webpack_require__(224);
	
	var _withRouter3 = _interopRequireDefault(_withRouter2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.BrowserRouter = _BrowserRouter3.default;
	exports.HashRouter = _HashRouter3.default;
	exports.Link = _Link3.default;
	exports.MemoryRouter = _MemoryRouter3.default;
	exports.NavLink = _NavLink3.default;
	exports.Prompt = _Prompt3.default;
	exports.Redirect = _Redirect3.default;
	exports.Route = _Route3.default;
	exports.Router = _Router3.default;
	exports.StaticRouter = _StaticRouter3.default;
	exports.Switch = _Switch3.default;
	exports.matchPath = _matchPath3.default;
	exports.withRouter = _withRouter3.default;

/***/ }),

/***/ 186:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _propTypes = __webpack_require__(187);
	
	var _propTypes2 = _interopRequireDefault(_propTypes);
	
	var _createBrowserHistory = __webpack_require__(189);
	
	var _createBrowserHistory2 = _interopRequireDefault(_createBrowserHistory);
	
	var _reactRouter = __webpack_require__(198);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	/**
	 * The public API for a <Router> that uses HTML5 history.
	 */
	var BrowserRouter = function (_React$Component) {
	  _inherits(BrowserRouter, _React$Component);
	
	  function BrowserRouter() {
	    var _temp, _this, _ret;
	
	    _classCallCheck(this, BrowserRouter);
	
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }
	
	    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.history = (0, _createBrowserHistory2.default)(_this.props), _temp), _possibleConstructorReturn(_this, _ret);
	  }
	
	  BrowserRouter.prototype.render = function render() {
	    return _react2.default.createElement(_reactRouter.Router, { history: this.history, children: this.props.children });
	  };
	
	  return BrowserRouter;
	}(_react2.default.Component);
	
	BrowserRouter.propTypes = {
	  basename: _propTypes2.default.string,
	  forceRefresh: _propTypes2.default.bool,
	  getUserConfirmation: _propTypes2.default.func,
	  keyLength: _propTypes2.default.number,
	  children: _propTypes2.default.node
	};
	exports.default = BrowserRouter;

/***/ }),

/***/ 189:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _warning = __webpack_require__(190);
	
	var _warning2 = _interopRequireDefault(_warning);
	
	var _invariant = __webpack_require__(191);
	
	var _invariant2 = _interopRequireDefault(_invariant);
	
	var _LocationUtils = __webpack_require__(192);
	
	var _PathUtils = __webpack_require__(195);
	
	var _createTransitionManager = __webpack_require__(196);
	
	var _createTransitionManager2 = _interopRequireDefault(_createTransitionManager);
	
	var _DOMUtils = __webpack_require__(197);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var PopStateEvent = 'popstate';
	var HashChangeEvent = 'hashchange';
	
	var getHistoryState = function getHistoryState() {
	  try {
	    return window.history.state || {};
	  } catch (e) {
	    // IE 11 sometimes throws when accessing window.history.state
	    // See https://github.com/ReactTraining/history/pull/289
	    return {};
	  }
	};
	
	/**
	 * Creates a history object that uses the HTML5 history API including
	 * pushState, replaceState, and the popstate event.
	 */
	var createBrowserHistory = function createBrowserHistory() {
	  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	
	  (0, _invariant2.default)(_DOMUtils.canUseDOM, 'Browser history needs a DOM');
	
	  var globalHistory = window.history;
	  var canUseHistory = (0, _DOMUtils.supportsHistory)();
	  var needsHashChangeListener = !(0, _DOMUtils.supportsPopStateOnHashChange)();
	
	  var _props$forceRefresh = props.forceRefresh,
	      forceRefresh = _props$forceRefresh === undefined ? false : _props$forceRefresh,
	      _props$getUserConfirm = props.getUserConfirmation,
	      getUserConfirmation = _props$getUserConfirm === undefined ? _DOMUtils.getConfirmation : _props$getUserConfirm,
	      _props$keyLength = props.keyLength,
	      keyLength = _props$keyLength === undefined ? 6 : _props$keyLength;
	
	  var basename = props.basename ? (0, _PathUtils.stripTrailingSlash)((0, _PathUtils.addLeadingSlash)(props.basename)) : '';
	
	  var getDOMLocation = function getDOMLocation(historyState) {
	    var _ref = historyState || {},
	        key = _ref.key,
	        state = _ref.state;
	
	    var _window$location = window.location,
	        pathname = _window$location.pathname,
	        search = _window$location.search,
	        hash = _window$location.hash;
	
	
	    var path = pathname + search + hash;
	
	    (0, _warning2.default)(!basename || (0, _PathUtils.hasBasename)(path, basename), 'You are attempting to use a basename on a page whose URL path does not begin ' + 'with the basename. Expected path "' + path + '" to begin with "' + basename + '".');
	
	    if (basename) path = (0, _PathUtils.stripBasename)(path, basename);
	
	    return (0, _LocationUtils.createLocation)(path, state, key);
	  };
	
	  var createKey = function createKey() {
	    return Math.random().toString(36).substr(2, keyLength);
	  };
	
	  var transitionManager = (0, _createTransitionManager2.default)();
	
	  var setState = function setState(nextState) {
	    _extends(history, nextState);
	
	    history.length = globalHistory.length;
	
	    transitionManager.notifyListeners(history.location, history.action);
	  };
	
	  var handlePopState = function handlePopState(event) {
	    // Ignore extraneous popstate events in WebKit.
	    if ((0, _DOMUtils.isExtraneousPopstateEvent)(event)) return;
	
	    handlePop(getDOMLocation(event.state));
	  };
	
	  var handleHashChange = function handleHashChange() {
	    handlePop(getDOMLocation(getHistoryState()));
	  };
	
	  var forceNextPop = false;
	
	  var handlePop = function handlePop(location) {
	    if (forceNextPop) {
	      forceNextPop = false;
	      setState();
	    } else {
	      var action = 'POP';
	
	      transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
	        if (ok) {
	          setState({ action: action, location: location });
	        } else {
	          revertPop(location);
	        }
	      });
	    }
	  };
	
	  var revertPop = function revertPop(fromLocation) {
	    var toLocation = history.location;
	
	    // TODO: We could probably make this more reliable by
	    // keeping a list of keys we've seen in sessionStorage.
	    // Instead, we just default to 0 for keys we don't know.
	
	    var toIndex = allKeys.indexOf(toLocation.key);
	
	    if (toIndex === -1) toIndex = 0;
	
	    var fromIndex = allKeys.indexOf(fromLocation.key);
	
	    if (fromIndex === -1) fromIndex = 0;
	
	    var delta = toIndex - fromIndex;
	
	    if (delta) {
	      forceNextPop = true;
	      go(delta);
	    }
	  };
	
	  var initialLocation = getDOMLocation(getHistoryState());
	  var allKeys = [initialLocation.key];
	
	  // Public interface
	
	  var createHref = function createHref(location) {
	    return basename + (0, _PathUtils.createPath)(location);
	  };
	
	  var push = function push(path, state) {
	    (0, _warning2.default)(!((typeof path === 'undefined' ? 'undefined' : _typeof(path)) === 'object' && path.state !== undefined && state !== undefined), 'You should avoid providing a 2nd state argument to push when the 1st ' + 'argument is a location-like object that already has state; it is ignored');
	
	    var action = 'PUSH';
	    var location = (0, _LocationUtils.createLocation)(path, state, createKey(), history.location);
	
	    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
	      if (!ok) return;
	
	      var href = createHref(location);
	      var key = location.key,
	          state = location.state;
	
	
	      if (canUseHistory) {
	        globalHistory.pushState({ key: key, state: state }, null, href);
	
	        if (forceRefresh) {
	          window.location.href = href;
	        } else {
	          var prevIndex = allKeys.indexOf(history.location.key);
	          var nextKeys = allKeys.slice(0, prevIndex === -1 ? 0 : prevIndex + 1);
	
	          nextKeys.push(location.key);
	          allKeys = nextKeys;
	
	          setState({ action: action, location: location });
	        }
	      } else {
	        (0, _warning2.default)(state === undefined, 'Browser history cannot push state in browsers that do not support HTML5 history');
	
	        window.location.href = href;
	      }
	    });
	  };
	
	  var replace = function replace(path, state) {
	    (0, _warning2.default)(!((typeof path === 'undefined' ? 'undefined' : _typeof(path)) === 'object' && path.state !== undefined && state !== undefined), 'You should avoid providing a 2nd state argument to replace when the 1st ' + 'argument is a location-like object that already has state; it is ignored');
	
	    var action = 'REPLACE';
	    var location = (0, _LocationUtils.createLocation)(path, state, createKey(), history.location);
	
	    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
	      if (!ok) return;
	
	      var href = createHref(location);
	      var key = location.key,
	          state = location.state;
	
	
	      if (canUseHistory) {
	        globalHistory.replaceState({ key: key, state: state }, null, href);
	
	        if (forceRefresh) {
	          window.location.replace(href);
	        } else {
	          var prevIndex = allKeys.indexOf(history.location.key);
	
	          if (prevIndex !== -1) allKeys[prevIndex] = location.key;
	
	          setState({ action: action, location: location });
	        }
	      } else {
	        (0, _warning2.default)(state === undefined, 'Browser history cannot replace state in browsers that do not support HTML5 history');
	
	        window.location.replace(href);
	      }
	    });
	  };
	
	  var go = function go(n) {
	    globalHistory.go(n);
	  };
	
	  var goBack = function goBack() {
	    return go(-1);
	  };
	
	  var goForward = function goForward() {
	    return go(1);
	  };
	
	  var listenerCount = 0;
	
	  var checkDOMListeners = function checkDOMListeners(delta) {
	    listenerCount += delta;
	
	    if (listenerCount === 1) {
	      (0, _DOMUtils.addEventListener)(window, PopStateEvent, handlePopState);
	
	      if (needsHashChangeListener) (0, _DOMUtils.addEventListener)(window, HashChangeEvent, handleHashChange);
	    } else if (listenerCount === 0) {
	      (0, _DOMUtils.removeEventListener)(window, PopStateEvent, handlePopState);
	
	      if (needsHashChangeListener) (0, _DOMUtils.removeEventListener)(window, HashChangeEvent, handleHashChange);
	    }
	  };
	
	  var isBlocked = false;
	
	  var block = function block() {
	    var prompt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
	
	    var unblock = transitionManager.setPrompt(prompt);
	
	    if (!isBlocked) {
	      checkDOMListeners(1);
	      isBlocked = true;
	    }
	
	    return function () {
	      if (isBlocked) {
	        isBlocked = false;
	        checkDOMListeners(-1);
	      }
	
	      return unblock();
	    };
	  };
	
	  var listen = function listen(listener) {
	    var unlisten = transitionManager.appendListener(listener);
	    checkDOMListeners(1);
	
	    return function () {
	      checkDOMListeners(-1);
	      unlisten();
	    };
	  };
	
	  var history = {
	    length: globalHistory.length,
	    action: 'POP',
	    location: initialLocation,
	    createHref: createHref,
	    push: push,
	    replace: replace,
	    go: go,
	    goBack: goBack,
	    goForward: goForward,
	    block: block,
	    listen: listen
	  };
	
	  return history;
	};
	
	exports.default = createBrowserHistory;

/***/ }),

/***/ 197:
/***/ (function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	var canUseDOM = exports.canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);
	
	var addEventListener = exports.addEventListener = function addEventListener(node, event, listener) {
	  return node.addEventListener ? node.addEventListener(event, listener, false) : node.attachEvent('on' + event, listener);
	};
	
	var removeEventListener = exports.removeEventListener = function removeEventListener(node, event, listener) {
	  return node.removeEventListener ? node.removeEventListener(event, listener, false) : node.detachEvent('on' + event, listener);
	};
	
	var getConfirmation = exports.getConfirmation = function getConfirmation(message, callback) {
	  return callback(window.confirm(message));
	}; // eslint-disable-line no-alert
	
	/**
	 * Returns true if the HTML5 history API is supported. Taken from Modernizr.
	 *
	 * https://github.com/Modernizr/Modernizr/blob/master/LICENSE
	 * https://github.com/Modernizr/Modernizr/blob/master/feature-detects/history.js
	 * changed to avoid false negatives for Windows Phones: https://github.com/reactjs/react-router/issues/586
	 */
	var supportsHistory = exports.supportsHistory = function supportsHistory() {
	  var ua = window.navigator.userAgent;
	
	  if ((ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) && ua.indexOf('Mobile Safari') !== -1 && ua.indexOf('Chrome') === -1 && ua.indexOf('Windows Phone') === -1) return false;
	
	  return window.history && 'pushState' in window.history;
	};
	
	/**
	 * Returns true if browser fires popstate on hash change.
	 * IE10 and IE11 do not.
	 */
	var supportsPopStateOnHashChange = exports.supportsPopStateOnHashChange = function supportsPopStateOnHashChange() {
	  return window.navigator.userAgent.indexOf('Trident') === -1;
	};
	
	/**
	 * Returns false if using go(n) with hash history causes a full page reload.
	 */
	var supportsGoWithoutReloadUsingHash = exports.supportsGoWithoutReloadUsingHash = function supportsGoWithoutReloadUsingHash() {
	  return window.navigator.userAgent.indexOf('Firefox') === -1;
	};
	
	/**
	 * Returns true if a given popstate event is an extraneous WebKit event.
	 * Accounts for the fact that Chrome on iOS fires real popstate events
	 * containing undefined state when pressing the back button.
	 */
	var isExtraneousPopstateEvent = exports.isExtraneousPopstateEvent = function isExtraneousPopstateEvent(event) {
	  return event.state === undefined && navigator.userAgent.indexOf('CriOS') === -1;
	};

/***/ }),

/***/ 212:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _propTypes = __webpack_require__(187);
	
	var _propTypes2 = _interopRequireDefault(_propTypes);
	
	var _createHashHistory = __webpack_require__(213);
	
	var _createHashHistory2 = _interopRequireDefault(_createHashHistory);
	
	var _reactRouter = __webpack_require__(198);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	/**
	 * The public API for a <Router> that uses window.location.hash.
	 */
	var HashRouter = function (_React$Component) {
	  _inherits(HashRouter, _React$Component);
	
	  function HashRouter() {
	    var _temp, _this, _ret;
	
	    _classCallCheck(this, HashRouter);
	
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }
	
	    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.history = (0, _createHashHistory2.default)(_this.props), _temp), _possibleConstructorReturn(_this, _ret);
	  }
	
	  HashRouter.prototype.render = function render() {
	    return _react2.default.createElement(_reactRouter.Router, { history: this.history, children: this.props.children });
	  };
	
	  return HashRouter;
	}(_react2.default.Component);
	
	HashRouter.propTypes = {
	  basename: _propTypes2.default.string,
	  getUserConfirmation: _propTypes2.default.func,
	  hashType: _propTypes2.default.oneOf(['hashbang', 'noslash', 'slash']),
	  children: _propTypes2.default.node
	};
	exports.default = HashRouter;

/***/ }),

/***/ 213:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _warning = __webpack_require__(190);
	
	var _warning2 = _interopRequireDefault(_warning);
	
	var _invariant = __webpack_require__(191);
	
	var _invariant2 = _interopRequireDefault(_invariant);
	
	var _LocationUtils = __webpack_require__(192);
	
	var _PathUtils = __webpack_require__(195);
	
	var _createTransitionManager = __webpack_require__(196);
	
	var _createTransitionManager2 = _interopRequireDefault(_createTransitionManager);
	
	var _DOMUtils = __webpack_require__(197);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var HashChangeEvent = 'hashchange';
	
	var HashPathCoders = {
	  hashbang: {
	    encodePath: function encodePath(path) {
	      return path.charAt(0) === '!' ? path : '!/' + (0, _PathUtils.stripLeadingSlash)(path);
	    },
	    decodePath: function decodePath(path) {
	      return path.charAt(0) === '!' ? path.substr(1) : path;
	    }
	  },
	  noslash: {
	    encodePath: _PathUtils.stripLeadingSlash,
	    decodePath: _PathUtils.addLeadingSlash
	  },
	  slash: {
	    encodePath: _PathUtils.addLeadingSlash,
	    decodePath: _PathUtils.addLeadingSlash
	  }
	};
	
	var getHashPath = function getHashPath() {
	  // We can't use window.location.hash here because it's not
	  // consistent across browsers - Firefox will pre-decode it!
	  var href = window.location.href;
	  var hashIndex = href.indexOf('#');
	  return hashIndex === -1 ? '' : href.substring(hashIndex + 1);
	};
	
	var pushHashPath = function pushHashPath(path) {
	  return window.location.hash = path;
	};
	
	var replaceHashPath = function replaceHashPath(path) {
	  var hashIndex = window.location.href.indexOf('#');
	
	  window.location.replace(window.location.href.slice(0, hashIndex >= 0 ? hashIndex : 0) + '#' + path);
	};
	
	var createHashHistory = function createHashHistory() {
	  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	
	  (0, _invariant2.default)(_DOMUtils.canUseDOM, 'Hash history needs a DOM');
	
	  var globalHistory = window.history;
	  var canGoWithoutReload = (0, _DOMUtils.supportsGoWithoutReloadUsingHash)();
	
	  var _props$getUserConfirm = props.getUserConfirmation,
	      getUserConfirmation = _props$getUserConfirm === undefined ? _DOMUtils.getConfirmation : _props$getUserConfirm,
	      _props$hashType = props.hashType,
	      hashType = _props$hashType === undefined ? 'slash' : _props$hashType;
	
	  var basename = props.basename ? (0, _PathUtils.stripTrailingSlash)((0, _PathUtils.addLeadingSlash)(props.basename)) : '';
	
	  var _HashPathCoders$hashT = HashPathCoders[hashType],
	      encodePath = _HashPathCoders$hashT.encodePath,
	      decodePath = _HashPathCoders$hashT.decodePath;
	
	
	  var getDOMLocation = function getDOMLocation() {
	    var path = decodePath(getHashPath());
	
	    (0, _warning2.default)(!basename || (0, _PathUtils.hasBasename)(path, basename), 'You are attempting to use a basename on a page whose URL path does not begin ' + 'with the basename. Expected path "' + path + '" to begin with "' + basename + '".');
	
	    if (basename) path = (0, _PathUtils.stripBasename)(path, basename);
	
	    return (0, _LocationUtils.createLocation)(path);
	  };
	
	  var transitionManager = (0, _createTransitionManager2.default)();
	
	  var setState = function setState(nextState) {
	    _extends(history, nextState);
	
	    history.length = globalHistory.length;
	
	    transitionManager.notifyListeners(history.location, history.action);
	  };
	
	  var forceNextPop = false;
	  var ignorePath = null;
	
	  var handleHashChange = function handleHashChange() {
	    var path = getHashPath();
	    var encodedPath = encodePath(path);
	
	    if (path !== encodedPath) {
	      // Ensure we always have a properly-encoded hash.
	      replaceHashPath(encodedPath);
	    } else {
	      var location = getDOMLocation();
	      var prevLocation = history.location;
	
	      if (!forceNextPop && (0, _LocationUtils.locationsAreEqual)(prevLocation, location)) return; // A hashchange doesn't always == location change.
	
	      if (ignorePath === (0, _PathUtils.createPath)(location)) return; // Ignore this change; we already setState in push/replace.
	
	      ignorePath = null;
	
	      handlePop(location);
	    }
	  };
	
	  var handlePop = function handlePop(location) {
	    if (forceNextPop) {
	      forceNextPop = false;
	      setState();
	    } else {
	      var action = 'POP';
	
	      transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
	        if (ok) {
	          setState({ action: action, location: location });
	        } else {
	          revertPop(location);
	        }
	      });
	    }
	  };
	
	  var revertPop = function revertPop(fromLocation) {
	    var toLocation = history.location;
	
	    // TODO: We could probably make this more reliable by
	    // keeping a list of paths we've seen in sessionStorage.
	    // Instead, we just default to 0 for paths we don't know.
	
	    var toIndex = allPaths.lastIndexOf((0, _PathUtils.createPath)(toLocation));
	
	    if (toIndex === -1) toIndex = 0;
	
	    var fromIndex = allPaths.lastIndexOf((0, _PathUtils.createPath)(fromLocation));
	
	    if (fromIndex === -1) fromIndex = 0;
	
	    var delta = toIndex - fromIndex;
	
	    if (delta) {
	      forceNextPop = true;
	      go(delta);
	    }
	  };
	
	  // Ensure the hash is encoded properly before doing anything else.
	  var path = getHashPath();
	  var encodedPath = encodePath(path);
	
	  if (path !== encodedPath) replaceHashPath(encodedPath);
	
	  var initialLocation = getDOMLocation();
	  var allPaths = [(0, _PathUtils.createPath)(initialLocation)];
	
	  // Public interface
	
	  var createHref = function createHref(location) {
	    return '#' + encodePath(basename + (0, _PathUtils.createPath)(location));
	  };
	
	  var push = function push(path, state) {
	    (0, _warning2.default)(state === undefined, 'Hash history cannot push state; it is ignored');
	
	    var action = 'PUSH';
	    var location = (0, _LocationUtils.createLocation)(path, undefined, undefined, history.location);
	
	    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
	      if (!ok) return;
	
	      var path = (0, _PathUtils.createPath)(location);
	      var encodedPath = encodePath(basename + path);
	      var hashChanged = getHashPath() !== encodedPath;
	
	      if (hashChanged) {
	        // We cannot tell if a hashchange was caused by a PUSH, so we'd
	        // rather setState here and ignore the hashchange. The caveat here
	        // is that other hash histories in the page will consider it a POP.
	        ignorePath = path;
	        pushHashPath(encodedPath);
	
	        var prevIndex = allPaths.lastIndexOf((0, _PathUtils.createPath)(history.location));
	        var nextPaths = allPaths.slice(0, prevIndex === -1 ? 0 : prevIndex + 1);
	
	        nextPaths.push(path);
	        allPaths = nextPaths;
	
	        setState({ action: action, location: location });
	      } else {
	        (0, _warning2.default)(false, 'Hash history cannot PUSH the same path; a new entry will not be added to the history stack');
	
	        setState();
	      }
	    });
	  };
	
	  var replace = function replace(path, state) {
	    (0, _warning2.default)(state === undefined, 'Hash history cannot replace state; it is ignored');
	
	    var action = 'REPLACE';
	    var location = (0, _LocationUtils.createLocation)(path, undefined, undefined, history.location);
	
	    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
	      if (!ok) return;
	
	      var path = (0, _PathUtils.createPath)(location);
	      var encodedPath = encodePath(basename + path);
	      var hashChanged = getHashPath() !== encodedPath;
	
	      if (hashChanged) {
	        // We cannot tell if a hashchange was caused by a REPLACE, so we'd
	        // rather setState here and ignore the hashchange. The caveat here
	        // is that other hash histories in the page will consider it a POP.
	        ignorePath = path;
	        replaceHashPath(encodedPath);
	      }
	
	      var prevIndex = allPaths.indexOf((0, _PathUtils.createPath)(history.location));
	
	      if (prevIndex !== -1) allPaths[prevIndex] = path;
	
	      setState({ action: action, location: location });
	    });
	  };
	
	  var go = function go(n) {
	    (0, _warning2.default)(canGoWithoutReload, 'Hash history go(n) causes a full page reload in this browser');
	
	    globalHistory.go(n);
	  };
	
	  var goBack = function goBack() {
	    return go(-1);
	  };
	
	  var goForward = function goForward() {
	    return go(1);
	  };
	
	  var listenerCount = 0;
	
	  var checkDOMListeners = function checkDOMListeners(delta) {
	    listenerCount += delta;
	
	    if (listenerCount === 1) {
	      (0, _DOMUtils.addEventListener)(window, HashChangeEvent, handleHashChange);
	    } else if (listenerCount === 0) {
	      (0, _DOMUtils.removeEventListener)(window, HashChangeEvent, handleHashChange);
	    }
	  };
	
	  var isBlocked = false;
	
	  var block = function block() {
	    var prompt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
	
	    var unblock = transitionManager.setPrompt(prompt);
	
	    if (!isBlocked) {
	      checkDOMListeners(1);
	      isBlocked = true;
	    }
	
	    return function () {
	      if (isBlocked) {
	        isBlocked = false;
	        checkDOMListeners(-1);
	      }
	
	      return unblock();
	    };
	  };
	
	  var listen = function listen(listener) {
	    var unlisten = transitionManager.appendListener(listener);
	    checkDOMListeners(1);
	
	    return function () {
	      checkDOMListeners(-1);
	      unlisten();
	    };
	  };
	
	  var history = {
	    length: globalHistory.length,
	    action: 'POP',
	    location: initialLocation,
	    createHref: createHref,
	    push: push,
	    replace: replace,
	    go: go,
	    goBack: goBack,
	    goForward: goForward,
	    block: block,
	    listen: listen
	  };
	
	  return history;
	};
	
	exports.default = createHashHistory;

/***/ }),

/***/ 214:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _propTypes = __webpack_require__(187);
	
	var _propTypes2 = _interopRequireDefault(_propTypes);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var isModifiedEvent = function isModifiedEvent(event) {
	  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
	};
	
	/**
	 * The public API for rendering a history-aware <a>.
	 */
	
	var Link = function (_React$Component) {
	  _inherits(Link, _React$Component);
	
	  function Link() {
	    var _temp, _this, _ret;
	
	    _classCallCheck(this, Link);
	
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }
	
	    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.handleClick = function (event) {
	      if (_this.props.onClick) _this.props.onClick(event);
	
	      if (!event.defaultPrevented && // onClick prevented default
	      event.button === 0 && // ignore right clicks
	      !_this.props.target && // let browser handle "target=_blank" etc.
	      !isModifiedEvent(event) // ignore clicks with modifier keys
	      ) {
	          event.preventDefault();
	
	          var history = _this.context.router.history;
	          var _this$props = _this.props,
	              replace = _this$props.replace,
	              to = _this$props.to;
	
	
	          if (replace) {
	            history.replace(to);
	          } else {
	            history.push(to);
	          }
	        }
	    }, _temp), _possibleConstructorReturn(_this, _ret);
	  }
	
	  Link.prototype.render = function render() {
	    var _props = this.props,
	        replace = _props.replace,
	        to = _props.to,
	        props = _objectWithoutProperties(_props, ['replace', 'to']); // eslint-disable-line no-unused-vars
	
	    var href = this.context.router.history.createHref(typeof to === 'string' ? { pathname: to } : to);
	
	    return _react2.default.createElement('a', _extends({}, props, { onClick: this.handleClick, href: href }));
	  };
	
	  return Link;
	}(_react2.default.Component);
	
	Link.propTypes = {
	  onClick: _propTypes2.default.func,
	  target: _propTypes2.default.string,
	  replace: _propTypes2.default.bool,
	  to: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.object]).isRequired
	};
	Link.defaultProps = {
	  replace: false
	};
	Link.contextTypes = {
	  router: _propTypes2.default.shape({
	    history: _propTypes2.default.shape({
	      push: _propTypes2.default.func.isRequired,
	      replace: _propTypes2.default.func.isRequired,
	      createHref: _propTypes2.default.func.isRequired
	    }).isRequired
	  }).isRequired
	};
	exports.default = Link;

/***/ }),

/***/ 215:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _reactRouter = __webpack_require__(198);
	
	Object.defineProperty(exports, 'default', {
	  enumerable: true,
	  get: function get() {
	    return _reactRouter.MemoryRouter;
	  }
	});

/***/ }),

/***/ 216:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _propTypes = __webpack_require__(187);
	
	var _propTypes2 = _interopRequireDefault(_propTypes);
	
	var _reactRouter = __webpack_require__(198);
	
	var _Link = __webpack_require__(214);
	
	var _Link2 = _interopRequireDefault(_Link);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
	
	/**
	 * A <Link> wrapper that knows if it's "active" or not.
	 */
	var NavLink = function NavLink(_ref) {
	  var to = _ref.to,
	      exact = _ref.exact,
	      strict = _ref.strict,
	      location = _ref.location,
	      activeClassName = _ref.activeClassName,
	      className = _ref.className,
	      activeStyle = _ref.activeStyle,
	      style = _ref.style,
	      getIsActive = _ref.isActive,
	      rest = _objectWithoutProperties(_ref, ['to', 'exact', 'strict', 'location', 'activeClassName', 'className', 'activeStyle', 'style', 'isActive']);
	
	  return _react2.default.createElement(_reactRouter.Route, {
	    path: (typeof to === 'undefined' ? 'undefined' : _typeof(to)) === 'object' ? to.pathname : to,
	    exact: exact,
	    strict: strict,
	    location: location,
	    children: function children(_ref2) {
	      var location = _ref2.location,
	          match = _ref2.match;
	
	      var isActive = !!(getIsActive ? getIsActive(match, location) : match);
	
	      return _react2.default.createElement(_Link2.default, _extends({
	        to: to,
	        className: isActive ? [activeClassName, className].filter(function (i) {
	          return i;
	        }).join(' ') : className,
	        style: isActive ? _extends({}, style, activeStyle) : style
	      }, rest));
	    }
	  });
	};
	
	NavLink.propTypes = {
	  to: _Link2.default.propTypes.to,
	  exact: _propTypes2.default.bool,
	  strict: _propTypes2.default.bool,
	  location: _propTypes2.default.object,
	  activeClassName: _propTypes2.default.string,
	  className: _propTypes2.default.string,
	  activeStyle: _propTypes2.default.object,
	  style: _propTypes2.default.object,
	  isActive: _propTypes2.default.func
	};
	
	NavLink.defaultProps = {
	  activeClassName: 'active'
	};
	
	exports.default = NavLink;

/***/ }),

/***/ 217:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _reactRouter = __webpack_require__(198);
	
	Object.defineProperty(exports, 'default', {
	  enumerable: true,
	  get: function get() {
	    return _reactRouter.Prompt;
	  }
	});

/***/ }),

/***/ 218:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _reactRouter = __webpack_require__(198);
	
	Object.defineProperty(exports, 'default', {
	  enumerable: true,
	  get: function get() {
	    return _reactRouter.Redirect;
	  }
	});

/***/ }),

/***/ 219:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _reactRouter = __webpack_require__(198);
	
	Object.defineProperty(exports, 'default', {
	  enumerable: true,
	  get: function get() {
	    return _reactRouter.Route;
	  }
	});

/***/ }),

/***/ 220:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _reactRouter = __webpack_require__(198);
	
	Object.defineProperty(exports, 'default', {
	  enumerable: true,
	  get: function get() {
	    return _reactRouter.Router;
	  }
	});

/***/ }),

/***/ 221:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _reactRouter = __webpack_require__(198);
	
	Object.defineProperty(exports, 'default', {
	  enumerable: true,
	  get: function get() {
	    return _reactRouter.StaticRouter;
	  }
	});

/***/ }),

/***/ 222:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _reactRouter = __webpack_require__(198);
	
	Object.defineProperty(exports, 'default', {
	  enumerable: true,
	  get: function get() {
	    return _reactRouter.Switch;
	  }
	});

/***/ }),

/***/ 223:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _reactRouter = __webpack_require__(198);
	
	Object.defineProperty(exports, 'default', {
	  enumerable: true,
	  get: function get() {
	    return _reactRouter.matchPath;
	  }
	});

/***/ }),

/***/ 224:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _reactRouter = __webpack_require__(198);
	
	Object.defineProperty(exports, 'default', {
	  enumerable: true,
	  get: function get() {
	    return _reactRouter.withRouter;
	  }
	});

/***/ }),

/***/ 225:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	__webpack_require__(226);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var Home = function Home() {
	    return _react2.default.createElement(
	        'div',
	        { className: 'home' },
	        _react2.default.createElement(
	            'h2',
	            null,
	            'Home'
	        )
	    );
	};
	
	exports.default = Home;

/***/ }),

/***/ 226:
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(227);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(229)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../../../node_modules/css-loader/index.js!./index.css", function() {
				var newContent = require("!!../../../node_modules/css-loader/index.js!./index.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),

/***/ 227:
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(228)();
	// imports
	
	
	// module
	exports.push([module.id, ".home h2 {\n  color: red; }\n", ""]);
	
	// exports


/***/ }),

/***/ 228:
/***/ (function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];
	
		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
	
		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ }),

/***/ 229:
/***/ (function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(self.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];
	
	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}
	
		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();
	
		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";
	
		var styles = listToStyles(list);
		addStylesToDom(styles, options);
	
		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}
	
	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}
	
	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}
	
	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}
	
	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}
	
	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}
	
	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}
	
	function addStyle(obj, options) {
		var styleElement, update, remove;
	
		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}
	
		update(obj);
	
		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}
	
	var replaceText = (function () {
		var textStore = [];
	
		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();
	
	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;
	
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}
	
	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
	
		if(media) {
			styleElement.setAttribute("media", media)
		}
	
		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}
	
	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;
	
		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}
	
		var blob = new Blob([css], { type: "text/css" });
	
		var oldSrc = linkElement.href;
	
		linkElement.href = URL.createObjectURL(blob);
	
		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }),

/***/ 230:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var About = function About() {
	    return _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement(
	            'h2',
	            null,
	            'About'
	        )
	    );
	};
	
	exports.default = About;

/***/ }),

/***/ 231:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactRouterDom = __webpack_require__(185);
	
	var _topic = __webpack_require__(232);
	
	var _topic2 = _interopRequireDefault(_topic);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var Topics = function Topics(_ref) {
	    var match = _ref.match;
	    return _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement(
	            'h2',
	            null,
	            'Topics'
	        ),
	        _react2.default.createElement(
	            'ul',
	            null,
	            _react2.default.createElement(
	                'li',
	                null,
	                _react2.default.createElement(
	                    _reactRouterDom.Link,
	                    { to: match.url + '/rendering' },
	                    'Rendering with React'
	                )
	            ),
	            _react2.default.createElement(
	                'li',
	                null,
	                _react2.default.createElement(
	                    _reactRouterDom.Link,
	                    { to: match.url + '/components' },
	                    'Components'
	                )
	            ),
	            _react2.default.createElement(
	                'li',
	                null,
	                _react2.default.createElement(
	                    _reactRouterDom.Link,
	                    { to: match.url + '/props-v-state' },
	                    'Props v. State'
	                )
	            )
	        ),
	        _react2.default.createElement(_reactRouterDom.Route, { path: match.url + '/:topicId', component: _topic2.default }),
	        _react2.default.createElement(_reactRouterDom.Route, { exact: true, path: match.url, render: function render() {
	                return _react2.default.createElement(
	                    'h3',
	                    null,
	                    'Please select a topic.'
	                );
	            } })
	    );
	};
	
	exports.default = Topics;

/***/ }),

/***/ 232:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var Topic = function Topic(_ref) {
	    var match = _ref.match;
	    return _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement(
	            'h3',
	            null,
	            match.params.topicId
	        )
	    );
	};
	
	exports.default = Topic;

/***/ }),

/***/ 233:
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(234);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(229)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../node_modules/css-loader/index.js!./index.css", function() {
				var newContent = require("!!../node_modules/css-loader/index.js!./index.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),

/***/ 234:
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(228)();
	// imports
	
	
	// module
	exports.push([module.id, "body {\n  margin: 0;\n  padding: 0;\n  font-family: sans-serif; }\n", ""]);
	
	// exports


/***/ })

});
//# sourceMappingURL=index.bundle.js.map