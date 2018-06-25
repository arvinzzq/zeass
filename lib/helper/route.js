'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var PREFIX = '$$route';
var methods = ['get', 'post', 'put', 'patch', 'delete'];

var routeMethod = {};

function destruct(args) {
  var hasPath = typeof args[0] === 'string';
  var path = hasPath ? args[0] : '';
  var middleware = hasPath ? args.slice(1) : args;
  if (middleware.filter(function (m) {
    return typeof m !== 'function';
  }).length) {
    throw new Error('Middleware must be function');
  }
  return {
    path: path,
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
      path = _destruct.path,
      middleware = _destruct.middleware;

  return function (target, name) {
    var key = PREFIX + '-' + method;
    if (!target[key]) {
      target[key] = [];
    } else {
      target[key].push({
        method: method,
        name: name,
        path: path,
        middleware: middleware
      });
    }
  };
}

routeMethod.route = route;

exports.default = routeMethod;