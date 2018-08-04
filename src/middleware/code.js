import path from 'path';
import { pathConfig } from '../helper/utils';

const CODE = require(path.resolve(process.cwd(), pathConfig('server'), 'config/code.json'));

export default async (ctx, next) => {
  ctx.CODE = CODE;
  await next();
};
