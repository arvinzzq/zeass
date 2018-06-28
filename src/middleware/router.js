import fs from 'fs';
import path from 'path';
import Router from 'koa-router';

const router = new Router();
const cwd = process.cwd();
const controllerPath = path.resolve(cwd, 'server/controller');
const routerDefaultConfig = JSON.parse(fs.readFileSync(path.resolve(cwd, 'server/router/default.json')) || {});
const routerConfigPath = path.resolve(cwd, 'server/router/router.config');
const routerConfigPrefix = '# This file is automatic generated when server is started.'
const noop = () => {};
const routerConfig = [];

function addRouterConfig(method, url, ctrlName, fnName) {
  routerConfig.push({
    method,
    url,
    ctrlName,
    fnName
  });
}

function parseRouterConfig(key, val) {
  const [method, url] = key.split(' ');
  const [ctrlName, name] = val.split('.');
  return {
    method,
    url,
    Controller: require(path.resolve(controllerPath, ctrlName)).default,
    name
  };
}

const controllers = fs.readdirSync(controllerPath)
  .map(file => require(path.resolve(controllerPath, file)).default);

controllers.forEach(Controller => {
  const controller = new Controller();
  const { $$routes } = controller;
  $$routes.forEach(item => {
    const { method, name, url, middleware } = item;
    addRouterConfig(method, url, controller.constructor.name, name);
    router[method](url, ...middleware, controller[name]);
  });
});

Object.keys(routerDefaultConfig).forEach(key => {
  const { method, url, Controller, name } = parseRouterConfig(key, routerDefaultConfig[key]);
  const controller = new Controller();
  addRouterConfig(method, url, controller.constructor.name, name);
  router[method](url, controller[name]);
});

routerConfig.sort((a, b) => a.ctrlName.localeCompare(b.ctrlName));

fs.writeFile(routerConfigPath, `${routerConfigPrefix}\n\n${routerConfig
  .map(item => `[${item.method.toUpperCase()}] ${item.url} ===> ${item.ctrlName}.${item.fnName}`)
  .join('\n')}`, noop);

export default router;
