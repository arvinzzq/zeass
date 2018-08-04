function jsonMiddleware(status, data) {
  this.body = { ...status, data };
}

export default async (ctx, next) => {
  ctx.json = jsonMiddleware.bind(ctx);
  await next();
};
