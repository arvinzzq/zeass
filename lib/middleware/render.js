'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _nunjucks = require('nunjucks');

var _nunjucks2 = _interopRequireDefault(_nunjucks);

var _utils = require('../helper/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var viewPath = _path2.default.resolve(process.cwd(), (0, _utils.pathConfig)('server'), 'view');

/**
 * Create env of Nunjuck for template render
 * @param {Object} options options for Nunjuck env
 */
function createEnv(options) {
  var _options$autoescape = options.autoescape,
      autoescape = _options$autoescape === undefined ? true : _options$autoescape,
      _options$noCache = options.noCache,
      noCache = _options$noCache === undefined ? false : _options$noCache,
      _options$watch = options.watch,
      watch = _options$watch === undefined ? false : _options$watch,
      _options$throwOnUndef = options.throwOnUndefined,
      throwOnUndefined = _options$throwOnUndef === undefined ? false : _options$throwOnUndef,
      filters = options.filters;


  var env = new _nunjucks2.default.Environment(new _nunjucks2.default.FileSystemLoader(viewPath, { noCache: noCache, watch: watch }), { autoescape: autoescape, throwOnUndefined: throwOnUndefined });

  // Add template filter to env.
  (0, _keys2.default)(filters).forEach(function (name) {
    env.addFilter(name, filters[name]);
  });
  return env;
}

/**
 * Initialize render method to ctx of each request
 * @param {Object} options options of render middleware
 */
var renderMiddleware = function renderMiddleware(options) {
  var _options$ext = options.ext,
      ext = _options$ext === undefined ? '.njk' : _options$ext,
      _options$global = options.global,
      global = _options$global === undefined ? {} : _options$global;

  var env = createEnv(options);

  (0, _keys2.default)(global).forEach(function (name) {
    env.addGlobal(name, global[name]);
  });

  return function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(ctx, next) {
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              ctx.render = function (view, data, callback) {
                ctx.response.body = env.render('' + view + ext, (0, _extends3.default)({}, ctx.state, data), callback);
                ctx.response.type = 'text/html';
              };
              _context.next = 3;
              return next();

            case 3:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }();
};

exports.default = renderMiddleware;