'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _koaBody = require('koa-body');

var _koaBody2 = _interopRequireDefault(_koaBody);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function bodyMiddleware(options) {
  return (0, _koaBody2.default)(_extends({
    formidable: { uploadDir: _path2.default.join('/tmp') },
    multipart: true,
    jsonLimit: '3mb',
    formLimit: '10mb',
    textLimit: '3mb'
  }, options));
}

exports.default = bodyMiddleware;