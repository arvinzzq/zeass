'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function throwError(errorMsg) {
  throw new Error(errorMsg);
}

var throwNameError = function throwNameError() {
  return throwError('Type of name must be string');
};

var throwParamsError = function throwParamsError() {
  return throwError('Params must be object of a pair of key and value');
};

var CtxState = function () {
  function CtxState() {
    (0, _classCallCheck3.default)(this, CtxState);

    this.state = {};
  }

  (0, _createClass3.default)(CtxState, [{
    key: 'hasState',
    value: function hasState(name) {
      if (typeof name !== 'string') {
        throwNameError();
      }
      return this.state.hasOwnProperty(name);
    }
  }, {
    key: 'getState',
    value: function getState(name) {
      if (typeof name !== 'string' && typeof name !== 'undefined') {
        throwNameError();
      }
      return name ? this.state[name] : this.state;
    }
  }, {
    key: 'setState',
    value: function setState() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      switch (args.length) {
        case 1:
          if ((0, _typeof3.default)(args[0]) === 'object') {
            this.state = args[0];
          } else {
            throwParamsError();
          }
          break;
        case 2:
          if (typeof args[0] === 'string') {
            this.state[args[0]] = args[1];
          } else {
            throwParamsError();
          }
          break;
        default:
          throwParamsError();
          break;
      }
    }
  }]);
  return CtxState;
}();

var stateMiddleware = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(ctx, next) {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            ctx.globalState = ctx.globalState || new CtxState();
            _context.next = 3;
            return next();

          case 3:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function stateMiddleware(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.default = stateMiddleware;