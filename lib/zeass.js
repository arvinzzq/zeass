'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _controller = require('./base/controller');

var _controller2 = _interopRequireDefault(_controller);

var _service = require('./base/service');

var _service2 = _interopRequireDefault(_service);

var _helper = require('./helper');

var _helper2 = _interopRequireDefault(_helper);

var _middleware = require('./middleware');

var _middleware2 = _interopRequireDefault(_middleware);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  Controller: _controller2.default,
  Service: _service2.default,
  helper: _helper2.default,
  middleware: _middleware2.default
};