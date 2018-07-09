'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = autobind;
/**
 * Return a descriptor removing the value and returning a getter
 * The getter will return a .bind version of the function
 */
function boundMethod(target, name, descriptor) {
  var fn = descriptor.value;

  if (typeof fn !== 'function') {
    throw new Error('@autobind decorator can only be applied to methods not: ' + (typeof fn === 'undefined' ? 'undefined' : _typeof(fn)));
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
  var keys = Object.getOwnPropertyNames(target.prototype);
  if (typeof Object.getOwnPropertySymbols === 'function') {
    keys = keys.concat(Object.getOwnPropertySymbols(target.prototype));
  }
  keys.forEach(function (key) {
    if (key === 'constructor') {
      return;
    }
    var descriptor = Object.getOwnPropertyDescriptor(target.prototype, key);
    if (typeof descriptor.value === 'function') {
      Object.defineProperty(target.prototype, key, boundMethod(target, key, descriptor));
    }
  });
  return target;
}

function autobind() {
  return arguments.length === 1 ? boundClass.apply(undefined, arguments) : boundMethod.apply(undefined, arguments);
}