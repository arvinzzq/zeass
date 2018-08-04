function authorize(target, key, descriptor) {
  const oldValue = descriptor.value;
  descriptor.value = async function (ctx, next) {
    const { user } = ctx.session;
    if (user) {
      return oldValue.call(this, ctx, next);
    }
    ctx.redirect(`/login?redirect=${ctx.request.href}`);
  };
  return descriptor;
}

export default authorize;
