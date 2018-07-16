import fs from 'fs';
import path from 'path';
import bunyan from 'bunyan';
import Sequelize from 'sequelize';
const Op = Sequelize.Op;

const Logger = bunyan.createLogger({
  name: 'MySQL',
  level: 'debug'
});
const modelWrappedMethods = ['findAll', 'create', 'bulkCreate', 'update', 'destroy', 'findById', 'findOne'];
const maxDuration = 500;

/**
 * Rewrite methods of prototype of sequelize model
 * @param {Array} nameMethod array of method name
 */
function wrapModelMethods(nameMethods) {
  if (!(nameMethods instanceof Array)) {
    throw new Error('nameMethods must be array');
  }
  nameMethods.forEach(nameMethod => {
    const oldMethod = Sequelize.Model.prototype[nameMethod];
    Sequelize.Model.prototype[nameMethod] = async function (...args) {
      const startTime = Date.now();
      const res = await oldMethod.apply(this, args);
      const duration = Date.now() - startTime;
      if (duration > maxDuration) {
        Logger.info(`[MySQL METHOD]: ${duration}ms ${this.tablename} ${nameMethod} ${JSON.stringify(args)}`);
      }
      return res;
    };
  });
}

wrapModelMethods(modelWrappedMethods);

/**
 * Reture models according to model define file within provided path
 * @param {Object} options options used to config sequelize
 */
function createModel(options) {
  const { mysqlConfig = {}, sequelizeConfig = {}, modelPath, excludeList = [] } = options;
  const { database, user, password, host, port } = mysqlConfig;
  if (!modelPath || typeof modelPath !== 'string') {
    throw new Error('path of model is required and must be string');
  }
  const sequelize = new Sequelize(database, user, password, {
    host,
    port,
    dialect: 'mysql',
    pool: {
      max: 200,
      min: 5,
      idle: 10000
    },
    operatorsAliases: Op, // use Sequelize.Op
    timezone: '+08:00',
    ...sequelizeConfig,
    define: {
      itmestamps: false, // disabled default timestamps model config,
      ...sequelizeConfig.define
    }
  });
  const filteredList = ['index.js', 'package.json'].concat(excludeList);
  const models = {};
  fs
    .readdirSync(path.join(modelPath, '/'))
    .filter(filename => (filteredList.indexOf(filename) === -1 && filename.indexOf('.js') !== -1))
    .forEach(filename => {
      const model = sequelize.import(path.join(modelPath, '/', filename));
      models[model.name] = model;
    });
  return models;
}

export default createModel;
