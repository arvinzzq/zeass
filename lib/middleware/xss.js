'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _xss = require('xss');

var _xss2 = _interopRequireDefault(_xss);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var filterOptions = ['whiteList', 'enableStyle'];

/**
 * escape all enumerable properties of params
 * @param {Object} params
 * @param {Function} escaper
 */
function paramEscape(params, escaper) {
  if ((typeof params === 'undefined' ? 'undefined' : _typeof(params)) !== 'object') {
    return params;
  }
  if (typeof escaper !== 'function') {
    throw new Error('escaper must be function');
  }
  var escapedParams = {};
  Object.keys(params).forEach(function (key) {
    escapedParams[key] = escaper(params[key]);
  });
  return escapedParams;
}

/**
 * Reture options combined with xss default configurations
 * @param {Object} options
 */
function generateOptions(options) {
  var enableStyle = options.enableStyle,
      whiteList = options.whiteList;

  var combinedWhiteList = _extends({}, _xss2.default.whiteList, whiteList);
  if (enableStyle) {
    Object.keys(combinedWhiteList).forEach(function (key) {
      return combinedWhiteList[key].push('style');
    });
  }
  // Clear options defined by middleware which is not required by xss filter
  var filteredOptions = {};
  Object.keys(options).filter(function (option) {
    return filterOptions.indexOf(option) === -1;
  }).forEach(function (item) {
    filteredOptions[item] = options[item];
  });
  return _extends({
    whiteList: combinedWhiteList
  }, filteredOptions);
}

function xssMiddleware() {
  var _this = this;

  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var xssInstance = new _xss2.default.FilterXSS(generateOptions(options));
  return function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(ctx, next) {
      var query, request, body, escaper;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              query = ctx.query, request = ctx.request;
              body = request.body;
              escaper = xssInstance.process.bind(xssInstance);

              ctx.query = paramEscape(query, escaper);
              ctx.request.body = paramEscape(body, escaper);
              _context.next = 7;
              return next();

            case 7:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this);
    }));

    return function (_x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }();
}

exports.default = xssMiddleware;