'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _csrf = require('csrf');

var _csrf2 = _interopRequireDefault(_csrf);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var tokens = new _csrf2.default();
var TOEKN = 'csrf-token';
var noop = function noop() {};
var fieldMethodMap = {
  header: function header(ctx, csrfName) {
    return ctx.request.headers[csrfName];
  },
  body: function body(ctx, csrfName) {
    return ctx.request.body[csrfName];
  },
  query: function query(ctx, csrfName) {
    return ctx.query[csrfName];
  }
};

function csrfSetter(options) {
  var _options$csrfName = options.csrfName,
      csrfName = _options$csrfName === undefined ? TOEKN : _options$csrfName;

  return function (target, key, descriptor) {
    var oldValue = descriptor.value;
    descriptor.value = function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(ctx, next) {
        var secret, token;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (ctx.session) {
                  _context.next = 2;
                  break;
                }

                throw new Error('session must be enabled when use csrf');

              case 2:
                secret = void 0;

                if (!ctx.session.secret) {
                  secret = tokens.secretSync();
                  ctx.session.secret = secret;
                } else {
                  secret = ctx.session.secret;
                }
                token = tokens.create(secret);

                ctx.globalState.setState(csrfName, token);
                oldValue.call(this, ctx, next);

              case 7:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function (_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }();
    return descriptor;
  };
}

function csrfValidator(options) {
  var _options$failCallback = options.failCallback,
      failCallback = _options$failCallback === undefined ? noop : _options$failCallback,
      _options$csrfName2 = options.csrfName,
      csrfName = _options$csrfName2 === undefined ? TOEKN : _options$csrfName2;

  return function () {
    var csrfField = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'header';
    return function (target, key, descriptor) {
      var oldValue = descriptor.value;
      descriptor.value = function () {
        var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(ctx, next) {
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  if (ctx.session && ctx.session.secret && tokens.verify(ctx.session.secret, fieldMethodMap[csrfField](ctx, csrfName))) {
                    oldValue.call(this, ctx, next);
                  } else {
                    failCallback.call(this, ctx, next);
                  }

                case 1:
                case 'end':
                  return _context2.stop();
              }
            }
          }, _callee2, this);
        }));

        return function (_x4, _x5) {
          return _ref2.apply(this, arguments);
        };
      }();
      return descriptor;
    };
  };
}

var CsrfValidation = function CsrfValidation() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  _classCallCheck(this, CsrfValidation);

  this.csrfSetter = csrfSetter(options);
  this.csrfValidator = csrfValidator(options);
};

exports.default = CsrfValidation;