import fs from 'fs';
import path from 'path';
import Router from 'koa-router';

const router = new Router();
const cwd = process.cwd();
const controllerPath = path.resolve(cwd, 'server/controller');
const routerPath = path.resolve(cwd, 'server/router');
const routerConfigPath = path.resolve(cwd, 'server/router/router.json');
const routerConfig = {};

const controllers = fs.readdirSync(controllerPath)
  .map(file => require(path.resolve(controllerPath, file)).default);

controllers.forEach(Controller => {
  const controller = new Controller();
  const { $$routes } = controller;
  $$routes.forEach(item => {
    const { method, name, url, middleware } = item;
    router[method](url, ...middleware, controller[name]);
  });
});

export default router;
