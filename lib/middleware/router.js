'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var router = new _koaRouter2.default();
var cwd = process.cwd();
var controllerPath = _path2.default.resolve(cwd, 'server/controller');
var routerPath = _path2.default.resolve(cwd, 'server/router');
var routerConfigPath = _path2.default.resolve(cwd, 'server/router/router.json');
var routerConfig = {};

var controllers = _fs2.default.readdirSync(controllerPath).map(function (file) {
  return require(_path2.default.resolve(controllerPath, file)).default;
});

controllers.forEach(function (Controller) {
  var controller = new Controller();
  var $$routes = controller.$$routes;

  $$routes.forEach(function (item) {
    var method = item.method,
        name = item.name,
        url = item.url,
        middleware = item.middleware;

    router[method].apply(router, [url].concat(_toConsumableArray(middleware), [controller[name]]));
  });
});

exports.default = router;