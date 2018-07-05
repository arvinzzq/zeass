'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _nunjucks = require('nunjucks');

var _nunjucks2 = _interopRequireDefault(_nunjucks);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var viewPath = _path2.default.resolve(process.cwd(), 'server/view');

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
  Object.keys(filters).forEach(function (name) {
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

  Object.keys(global).forEach(function (name) {
    env.addGlobal(name, global[name]);
  });

  return function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(ctx, next) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              ctx.render = function (view, data, callback) {
                ctx.response.body = env.render('' + view + ext, _extends({}, ctx.state, data), callback);
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