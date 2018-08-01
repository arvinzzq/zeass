'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _xss = require('xss');

var _xss2 = _interopRequireDefault(_xss);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var filterOptions = ['whiteList', 'enableStyle'];

/**
 * escape all enumerable properties of params
 * @param {Object} params
 * @param {Function} escaper
 */
function paramEscape(params, escaper) {
  if ((typeof params === 'undefined' ? 'undefined' : (0, _typeof3.default)(params)) !== 'object') {
    return params;
  }
  if (typeof escaper !== 'function') {
    throw new Error('escaper must be function');
  }
  var escapedParams = {};
  (0, _keys2.default)(params).forEach(function (key) {
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

  var combinedWhiteList = (0, _extends3.default)({}, _xss2.default.whiteList, whiteList);
  if (enableStyle) {
    (0, _keys2.default)(combinedWhiteList).forEach(function (key) {
      return combinedWhiteList[key].push('style');
    });
  }
  // Clear options defined by middleware which is not required by xss filter
  var filteredOptions = {};
  (0, _keys2.default)(options).filter(function (option) {
    return filterOptions.indexOf(option) === -1;
  }).forEach(function (item) {
    filteredOptions[item] = options[item];
  });
  return (0, _extends3.default)({
    whiteList: combinedWhiteList
  }, filteredOptions);
}

function xssMiddleware() {
  var _this = this;

  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var _options$whiteUrls = options.whiteUrls,
      whiteUrls = _options$whiteUrls === undefined ? [] : _options$whiteUrls;

  var xssInstance = new _xss2.default.FilterXSS(generateOptions(options));
  return function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(ctx, next) {
      var query, request, body, escaper;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (whiteUrls.indexOf(ctx.url) === -1) {
                query = ctx.query, request = ctx.request;
                body = request.body;
                escaper = xssInstance.process.bind(xssInstance);

                ctx.query = paramEscape(query, escaper);
                ctx.request.body = paramEscape(body, escaper);
              }
              _context.next = 3;
              return next();

            case 3:
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