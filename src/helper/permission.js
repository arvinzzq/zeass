import autobind from './autobind';
const noop = () => {};
/**
 * Create decoractor used for permission
 * @param {Function} checker method check wether has permission
 * @param {Function} successCallback callback when visitor has permission
 * @param {Function} failedCallback callback when visitor has no permission
 */
const needSomethingAsync = (checker, successCallback = noop, failedCallback = noop) => {
  return function(target, name, descriptor) {
    const oldValue = descriptor.value;
    descriptor.value = async function(...args) {
      const pass = await checker();
      if (pass) {
        successCallback();
        return oldValue.apply(this, args);
      } else {
        failedCallback();
      }
    }
  }
};

const needSomething = (checker, successCallback = noop, failedCallback = noop) => {
  return function(target, name, descriptor) {
    const oldValue = descriptor.value;
    descriptor.value = function(...args) {
      if (checker()) {
        successCallback();
        return oldValue.apply(this, args);
      } else {
        failedCallback();
      }
    }
  }
};

/**
 * Return closure function accept method which is used to fetch
 * user permission list and return checker closure that validate
 * visitor according to list used for validation.
 * @param {String} type array method used for validation
 * @param {Function} fnFetch method which is used to fetch permission list
 * @param {Array<String>} permissionList string list for validation
 */
const createValidationMethodAsync = type => fnFetch => async(...permissionList) => {
  if (typeof fnFetch !== 'function') {
    throw new Error('fnFetch must be function')
  }
  const list = await fnFetch();
  return list[type](item => (permissionList.indexOf(item) > -1));
};

const createValidationMethod = type => fnFetch => (...permissionList) => {
  if (typeof fnFetch !== 'function') {
    throw new Error('fnFetch must be function')
  }
  const list = fnFetch();
  return list[type](item => (permissionList.indexOf(item) > -1));
};

const needEveryPermissionAsync = createValidationMethodAsync('every');
const needEveryPermission = createValidationMethod('every');

const needAnyPermissionAsync = createValidationMethodAsync('some');
const needAnyPermission = createValidationMethod('some');

/**
 * Permission Class initialize instance for permission validation,
 * permission fetch method, success callback and failed callback
 * of frontend and backend are different.
 */

 // Async version permission
@autobind
class PermissionAsync {
  constructor(fnFetch, successCallback, failedCallback) {
    this.fnFetch = fnFetch;
    this.successCallback = successCallback;
    this.failedCallback = failedCallback;
  }
  // decoractor version method of needEveryPermission
  everyPermissionAsync(...list) {
    const checker = () => needEveryPermissionAsync(this.fnFetch)(...list);
    return needSomethingAsync(checker, this.successCallback, this.failedCallback);
  }

  // decoractor version method of needAnyPermission
  anyPermissionAsync(...list) {
    const checker = () => needAnyPermissionAsync(this.fnFetch)(...list);
    return needSomethingAsync(checker, this.successCallback, this.failedCallback);
  }

  get needEveryPermissionAsync() {
    return needEveryPermissionAsync(this.fnFetch);
  };

  get needAnyPermissionAsync() {
    return needAnyPermissionAsync(this.fnFetch);
  }
}

// Sync version permission
@autobind
class Permission {
  constructor(fnFetch, successCallback, failedCallback) {
    this.fnFetch = fnFetch;
    this.successCallback = successCallback;
    this.failedCallback = failedCallback;
  }
  // decoractor version method of needEveryPermission
  everyPermission(...list) {
    const checker = () => needEveryPermission(this.fnFetch)(...list);
    return needSomething(checker, this.successCallback, this.failedCallback);
  }

  // decoractor version method of needAnyPermission
  anyPermission(...list) {
    const checker = () => needAnyPermission(this.fnFetch)(...list);
    return needSomething(checker, this.successCallback, this.failedCallback);
  }

  get needEveryPermission() {
    return needEveryPermission(this.fnFetch);
  };

  get needAnyPermission() {
    return needAnyPermission(this.fnFetch);
  }
}

export {
  Permission,
  PermissionAsync
};