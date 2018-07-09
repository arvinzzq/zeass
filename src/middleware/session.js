import fs from 'fs';
import path from 'path';
import redisStore from 'koa-redis';
import session from 'koa-generic-session';
const cwd = process.cwd();
const pkgConfig = require(path.resolve(cwd, './package.json'))
const sessionConfig = require(path.resolve(cwd, './server/config/session.json'));

function storeConfig(type) {
  const configPath = path.resolve(cwd, `./server/config/${type}.json`);
  return (fs.existsSync(configPath) ? require(configPath) : {});
}

const mapStore = {
  redis: redisStore(storeConfig('redis'))
};

/**
 * Return session middleware of store according to store type,
 * when type is string return redis store or undefine which is 
 * default memory store, if type is object then directly use it
 * for session store.
 * @param {String|Object} type type name of store or store
 */
const sessionMiddleware = function(type) {
  if (typeof type !== 'string' && typeof type !== 'object' && typeof type !== 'undefined') {
    throw new Error('Type parameter must be either string or object, when it is passed');
  }
  return session({
    ...sessionConfig,
    store: typeof type === 'string' ? mapStore[type] : type,
    prefix: `${pkgConfig.name}:sess`
  });
}

export default sessionMiddleware;