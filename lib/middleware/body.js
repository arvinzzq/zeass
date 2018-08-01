'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _koaBody = require('koa-body');

var _koaBody2 = _interopRequireDefault(_koaBody);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function bodyMiddleware(options) {
  return (0, _koaBody2.default)((0, _extends3.default)({
    formidable: { uploadDir: _path2.default.join('/tmp') },
    multipart: true,
    jsonLimit: '3mb',
    formLimit: '10mb',
    textLimit: '3mb'
  }, options));
}

exports.default = bodyMiddleware;