import Tokens from 'csrf';

const tokens = new Tokens();
const TOEKN = 'csrf-token';
const noop = () => {};
const fieldMethodMap = {
  header: (ctx, csrfName) => ctx.request.headers[csrfName],
  body: (ctx, csrfName) => ctx.request.body[csrfName],
  query: (ctx, csrfName) => ctx.query[csrfName]
};

/**
 * csrf setter used for csrf and token generation
 * @param {Object} options
 */
function csrfSetter(options) {
  const { csrfName = TOEKN } = options;
  return (target, key, descriptor) => {
    const oldValue = descriptor.value;
    descriptor.value = async function (ctx, next) {
      if (!ctx.session) {
        throw new Error('session must be enabled when use csrf');
      }
      let secret;
      if (!ctx.session.secret) {
        secret = tokens.secretSync();
        ctx.session.secret = secret;
      } else {
        secret = ctx.session.secret;
      }
      const token = tokens.create(secret);
      ctx.globalState.setState(csrfName, token);
      oldValue.call(this, ctx, next);
    };
    return descriptor;
  };
}

/**
 * csrf validator used for request csrf token validation
 * @param {Object} options
 */
function csrfValidator(options) {
  const { failCallback = noop, csrfName = TOEKN } = options;
  return (csrfField = 'header') => (target, key, descriptor) => {
    const oldValue = descriptor.value;
    descriptor.value = async function (ctx, next) {
      if (ctx.session
        && ctx.session.secret
        && tokens.verify(ctx.session.secret, fieldMethodMap[csrfField](ctx, csrfName))) {
        oldValue.call(this, ctx, next);
      } else {
        failCallback.call(this, ctx, next);
      }
    };
    return descriptor;
  };
}

export default class CsrfValidation {
  constructor(options = {}) {
    this.csrfSetter = csrfSetter(options);
    this.csrfValidator = csrfValidator(options);
  }
}
