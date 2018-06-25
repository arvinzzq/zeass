const PREFIX = '$$route';
const methods = ['get', 'post', 'put', 'patch', 'delete'];

const routeMethod = {};

function destruct(args) {
  const hasPath = typeof args[0] === 'string';
  const path = hasPath ? args[0] : '';
  const middleware = hasPath ? args.slice(1) : args;
  if (middleware.filter(m => typeof m !== 'function').length) {
    throw new Error('Middleware must be function');
  }
  return {
    path,
    middleware
  };
}

function route(method, ...args) {
  if (methods.indexOf(method) === -1) {
    throw new Error('Invalid HTTP method');
  }
  const { path, middleware } = destruct(args);
  return (target, name) => {
    const key = `${PREFIX}-${method}`;
    if (!target[key]) {
      target[key] = [];
    } else {
      target[key].push({
        method,
        name,
        path,
        middleware
      });
    }
  };
}

routeMethod.route = route;

export default routeMethod;
