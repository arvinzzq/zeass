'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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
var routerDefaultConfig = JSON.parse(_fs2.default.readFileSync(_path2.default.resolve(cwd, 'server/router/default.json')) || {});
var routerConfigPath = _path2.default.resolve(cwd, 'server/router/router.config');
var routerConfigPrefix = '# This file is automatic generated when server is started.';
var noop = function noop() {};
var routerConfig = [];

/**
 * Add router config to routerConfig object.
 * @param {String} method
 * @param {String} url
 * @param {String} ctrlName
 * @param {String} fnName
 */
function addRouterConfig(method, url, ctrlName, fnName) {
  routerConfig.push({
    method: method,
    url: url,
    ctrlName: ctrlName,
    fnName: fnName
  });
}

/**
 * Return router config object include parsed
 * method, url, controller method nameand controller method
 * @param {String} key
 * @param {String} val
 */
function parseRouterConfig(key, val) {
  var _key$split = key.split(' '),
      _key$split2 = _slicedToArray(_key$split, 2),
      method = _key$split2[0],
      url = _key$split2[1];

  var _val$split = val.split('.'),
      _val$split2 = _slicedToArray(_val$split, 2),
      ctrlName = _val$split2[0],
      name = _val$split2[1];

  return {
    method: method,
    url: url,
    Controller: require(_path2.default.resolve(controllerPath, ctrlName)).default,
    name: name
  };
}

// Add routes according to default routes file.
Object.keys(routerDefaultConfig).forEach(function (key) {
  var _parseRouterConfig = parseRouterConfig(key, routerDefaultConfig[key]),
      method = _parseRouterConfig.method,
      url = _parseRouterConfig.url,
      Controller = _parseRouterConfig.Controller,
      name = _parseRouterConfig.name;

  var controller = new Controller();
  addRouterConfig(method, url, controller.constructor.name, name);
  router[method](url, controller[name]);
});

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

    addRouterConfig(method, url, controller.constructor.name, name);
    router[method].apply(router, [url].concat(_toConsumableArray(middleware), [controller[name]]));
  });
});

routerConfig.sort(function (a, b) {
  return a.ctrlName.localeCompare(b.ctrlName);
});

_fs2.default.writeFile(routerConfigPath, routerConfigPrefix + '\n\n' + routerConfig.map(function (item) {
  return '[' + item.method.toUpperCase() + '] ' + item.url + ' ===> ' + item.ctrlName + '.' + item.fnName;
}).join('\n'), noop);

exports.default = router;