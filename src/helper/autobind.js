/**
 * Return a descriptor removing the value and returning a getter
 * The getter will return a .bind version of the function
 */
function boundMethod(target, key, descriptor) {
  const fn = descriptor.value;

  if (typeof fn !== 'function') {
    throw new Error(`@autobind decorator can only be applied to methods not: ${typeof fn}`);
  }
  return {
    configurable: true,
    get() {
      return fn.bind(this);
    }
  };
}

/**
 * Use boundMethod to bind all methods on the target.prototype
 */
function boundClass(target) {
  let keys = Object.getOwnPropertyNames(target.prototype);
  if (typeof Object.getOwnPropertySymbols === 'function') {
    keys = keys.concat(Object.getOwnPropertySymbols(target.prototype));
  }
  keys.forEach((key) => {
    if (key === 'constructor') {
      return;
    }
    const descriptor = Object.getOwnPropertyDescriptor(target.prototype, key);
    if (typeof descriptor.value === 'function') {
      Object.defineProperty(target.prototype, key, boundMethod(target, key, descriptor));
    }
  });
  return target;
}

export default function autobind(...args) {
  return args.length === 1 ? boundClass(...args) : boundMethod(...args);
}
