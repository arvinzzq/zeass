function throwError(errorMsg) {
  throw new Error(errorMsg);
}

const throwNameError = () => throwError('Type of name must be string');

const throwParamsError = () => throwError('Params must be object of a pair of key and value');

class CtxState {
  constructor() {
    this.state = {};
  }

  hasState(name) {
    if (typeof name !== 'string') {
      throwNameError();
    }
    return this.state.hasOwnProperty(name);
  }

  getState(name) {
    if (typeof name !== 'string' && typeof name !== 'undefined') {
      throwNameError();
    }
    return name ? this.state[name] : this.state;
  }
  
  setState(...args) {
    switch (args.length) { 
      case 1:
        if (typeof args[0] === 'object') {
          this.state = args[0];
        } else {
          throwParamsError();
        }
        break;
      case 2:
        if (typeof args[0] === 'string') {
          this.state[args[0]] = args[1];
        } else {
          throwParamsError();
        }
        break;
      default: 
        throwParamsError();
        break;
    }
  }
}

const stateMiddleware = async function (ctx, next) {
  ctx.globalState = ctx.globalState || new CtxState();
  await next();
}

export default stateMiddleware;
