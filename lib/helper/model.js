'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _bunyan = require('bunyan');

var _bunyan2 = _interopRequireDefault(_bunyan);

var _sequelize = require('sequelize');

var _sequelize2 = _interopRequireDefault(_sequelize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Op = _sequelize2.default.Op;

var Logger = _bunyan2.default.createLogger({
  name: 'MySQL',
  level: 'debug'
});
var modelWrappedMethods = ['findAll', 'create', 'bulkCreate', 'update', 'destroy', 'findById', 'findOne'];
var maxDuration = 500;

/**
 * Rewrite methods of prototype of sequelize model
 * @param {Array} nameMethod array of method name
 */
function wrapModelMethods(nameMethods) {
  if (!(nameMethods instanceof Array)) {
    throw new Error('nameMethods must be array');
  }
  nameMethods.forEach(function (nameMethod) {
    var oldMethod = _sequelize2.default.Model.prototype[nameMethod];
    _sequelize2.default.Model.prototype[nameMethod] = function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var startTime, res, duration;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                startTime = Date.now();
                _context.next = 3;
                return oldMethod.apply(this, args);

              case 3:
                res = _context.sent;
                duration = Date.now() - startTime;

                if (duration > maxDuration) {
                  Logger.info('[MySQL METHOD]: ' + duration + 'ms ' + this.tablename + ' ' + nameMethod + ' ' + (0, _stringify2.default)(args));
                }
                return _context.abrupt('return', res);

              case 7:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function () {
        return _ref.apply(this, arguments);
      };
    }();
  });
}

wrapModelMethods(modelWrappedMethods);

/**
 * Reture models according to model define file within provided path
 * @param {Object} options options used to config sequelize
 */
function createModel(options) {
  var _options$mysqlConfig = options.mysqlConfig,
      mysqlConfig = _options$mysqlConfig === undefined ? {} : _options$mysqlConfig,
      _options$sequelizeCon = options.sequelizeConfig,
      sequelizeConfig = _options$sequelizeCon === undefined ? {} : _options$sequelizeCon,
      modelPath = options.modelPath,
      _options$excludeList = options.excludeList,
      excludeList = _options$excludeList === undefined ? [] : _options$excludeList;
  var database = mysqlConfig.database,
      user = mysqlConfig.user,
      password = mysqlConfig.password,
      host = mysqlConfig.host,
      port = mysqlConfig.port;

  if (!modelPath || typeof modelPath !== 'string') {
    throw new Error('path of model is required and must be string');
  }
  var sequelize = new _sequelize2.default(database, user, password, (0, _extends3.default)({
    host: host,
    port: port,
    dialect: 'mysql',
    pool: {
      max: 200,
      min: 5,
      idle: 10000
    },
    operatorsAliases: Op, // use Sequelize.Op
    timezone: '+08:00'
  }, sequelizeConfig, {
    define: (0, _extends3.default)({
      itmestamps: false }, sequelizeConfig.define)
  }));
  var filteredList = ['index.js', 'package.json'].concat(excludeList);
  var models = {};
  _fs2.default.readdirSync(_path2.default.join(modelPath, '/')).filter(function (filename) {
    return filteredList.indexOf(filename) === -1 && filename.indexOf('.js') !== -1;
  }).forEach(function (filename) {
    var model = sequelize.import(_path2.default.join(modelPath, '/', filename));
    models[model.name] = model;
  });
  return models;
}

exports.default = createModel;