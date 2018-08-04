import path from 'path';
import nunjucks from 'nunjucks';
import { pathConfig } from '../helper/utils';

const viewPath = path.resolve(process.cwd(), pathConfig('server'), 'view');

/**
 * Create env of Nunjuck for template render
 * @param {Object} options options for Nunjuck env
 */
function createEnv(options) {
  const {
    autoescape = true,
    noCache = false,
    watch = false,
    throwOnUndefined = false,
    filters
  } = options;

  const env = new nunjucks.Environment(
    new nunjucks.FileSystemLoader(viewPath, { noCache, watch }),
    { autoescape, throwOnUndefined },
  );

  // Add template filter to env.
  Object.keys(filters).forEach(name => {
    env.addFilter(name, filters[name]);
  });
  return env;
}

/**
 * Initialize render method to ctx of each request
 * @param {Object} options options of render middleware
 */
const renderMiddleware = options => {
  const {
    ext = '.njk',
    global = {}
  } = options;
  const env = createEnv(options);

  Object.keys(global).forEach(name => {
    env.addGlobal(name, global[name]);
  });

  return async (ctx, next) => {
    ctx.render = (view, data, callback) => {
      ctx.response.body = env.render(`${view}${ext}`, {
        ...ctx.state,
        ...data
      }, callback);
      ctx.response.type = 'text/html';
    };
    await next();
  };
};

export default renderMiddleware;
