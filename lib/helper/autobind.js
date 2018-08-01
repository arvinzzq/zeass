'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty = require('babel-runtime/core-js/object/define-property');

var _defineProperty2 = _interopRequireDefault(_defineProperty);

var _getOwnPropertyDescriptor = require('babel-runtime/core-js/object/get-own-property-descriptor');

var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

var _getOwnPropertySymbols = require('babel-runtime/core-js/object/get-own-property-symbols');

var _getOwnPropertySymbols2 = _interopRequireDefault(_getOwnPropertySymbols);

var _getOwnPropertyNames = require('babel-runtime/core-js/object/get-own-property-names');

var _getOwnPropertyNames2 = _interopRequireDefault(_getOwnPropertyNames);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

exports.default = autobind;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Return a descriptor removing the value and returning a getter
 * The getter will return a .bind version of the function
 */
function boundMethod(target, name, descriptor) {
  var fn = descriptor.value;

  if (typeof fn !== 'function') {
    throw new Error('@autobind decorator can only be applied to methods not: ' + (typeof fn === 'undefined' ? 'undefined' : (0, _typeof3.default)(fn)));
  }
  return {
    configurable: true,
    get: function get() {
      return fn.bind(this);
    }
  };
}

/**
 * Use boundMethod to bind all methods on the target.prototype
 */
function boundClass(target) {
  var keys = (0, _getOwnPropertyNames2.default)(target.prototype);
  if (typeof _getOwnPropertySymbols2.default === 'function') {
    keys = keys.concat((0, _getOwnPropertySymbols2.default)(target.prototype));
  }
  keys.forEach(function (key) {
    if (key === 'constructor') {
      return;
    }
    var descriptor = (0, _getOwnPropertyDescriptor2.default)(target.prototype, key);
    if (typeof descriptor.value === 'function') {
      (0, _defineProperty2.default)(target.prototype, key, boundMethod(target, key, descriptor));
    }
  });
  return target;
}

function autobind() {
  return arguments.length === 1 ? boundClass.apply(undefined, arguments) : boundMethod.apply(undefined, arguments);
}