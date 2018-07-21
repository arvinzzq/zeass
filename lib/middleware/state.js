'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
    _classCallCheck(this, CtxState);

    this.state = {};
  }

  _createClass(CtxState, [{
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
          if (_typeof(args[0]) === 'object') {
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
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(ctx, next) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
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