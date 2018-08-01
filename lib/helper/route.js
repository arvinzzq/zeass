'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _getOwnPropertyNames = require('babel-runtime/core-js/object/get-own-property-names');

var _getOwnPropertyNames2 = _interopRequireDefault(_getOwnPropertyNames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PREFIX = '$$route';
var methods = ['get', 'post', 'put', 'patch', 'delete'];

var routeMethod = {};

function destruct(args) {
  var hasUrl = typeof args[0] === 'string';
  var url = hasUrl ? args[0] : '';
  var middleware = hasUrl ? args.slice(1) : args;
  if (middleware.filter(function (m) {
    return typeof m !== 'function';
  }).length) {
    throw new Error('Middleware must be function');
  }
  return {
    url: url,
    middleware: middleware
  };
}

function route(method) {
  if (methods.indexOf(method) === -1) {
    throw new Error('Invalid HTTP method');
  }

  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  var _destruct = destruct(args),
      url = _destruct.url,
      middleware = _destruct.middleware;

  return function (target, name) {
    var key = PREFIX + '-' + method;
    if (!target[key]) {
      target[key] = [];
    }
    target[key].push({
      method: method,
      name: name,
      url: url,
      middleware: middleware
    });
  };
}

function controller() {
  for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  var _destruct2 = destruct(args),
      baseUrl = _destruct2.url,
      baseMiddleware = _destruct2.middleware;

  return function (target) {
    var proto = target.prototype;
    proto.$$routes = (0, _getOwnPropertyNames2.default)(proto).filter(function (property) {
      return property.indexOf(PREFIX) === 0;
    }).map(function (property) {
      return proto[property];
    }).reduce(function (prev, next) {
      return prev.concat(next);
    }, []).map(function (item) {
      return (0, _extends3.default)({}, item, {
        url: baseUrl + item.url,
        middleware: baseMiddleware.concat(item.middleware)
      });
    });
  };
}

methods.forEach(function (method) {
  routeMethod[method] = route.bind(null, method);
});

routeMethod.route = route;
routeMethod.controller = controller;

exports.default = routeMethod;