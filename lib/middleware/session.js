'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _koaRedis = require('koa-redis');

var _koaRedis2 = _interopRequireDefault(_koaRedis);

var _koaConvert = require('koa-convert');

var _koaConvert2 = _interopRequireDefault(_koaConvert);

var _koaGenericSession = require('koa-generic-session');

var _koaGenericSession2 = _interopRequireDefault(_koaGenericSession);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cwd = process.cwd();
var pkgConfig = require(_path2.default.resolve(cwd, './package.json'));
var sessionConfig = require(_path2.default.resolve(cwd, './server/config/session.json'));

function storeConfig(type) {
  var configPath = _path2.default.resolve(cwd, './server/config/' + type + '.json');
  return _fs2.default.existsSync(configPath) ? require(configPath) : {};
}

var mapStore = {
  redis: (0, _koaRedis2.default)(storeConfig('redis'))
};

/**
 * Return session middleware of store according to store type,
 * when type is string return redis store or undefine which is 
 * default memory store, if type is object then directly use it
 * for session store.
 * @param {String|Object} type type name of store or store
 */
var sessionMiddleware = function sessionMiddleware(type) {
  if (typeof type !== 'string' && (typeof type === 'undefined' ? 'undefined' : _typeof(type)) !== 'object' && typeof type !== 'undefined') {
    throw new Error('Type parameter must be either string or object, when it is passed');
  }
  return (0, _koaConvert2.default)((0, _koaGenericSession2.default)(_extends({}, sessionConfig, {
    store: typeof type === 'string' ? mapStore[type] : type,
    prefix: pkgConfig.name + ':sess'
  })));
};

exports.default = sessionMiddleware;