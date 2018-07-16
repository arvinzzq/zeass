import path from 'path';
const CODE = require(path.resolve(process.cwd(), './server/config/code.json'));

export default async (ctx, next) =>  {  
  ctx.CODE = CODE;
  await next();
};