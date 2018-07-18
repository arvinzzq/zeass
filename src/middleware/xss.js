import xss from 'xss';

const filterOptions = ['whiteList', 'enableStyle'];

/**
 * escape all enumerable properties of params
 * @param {Object} params
 * @param {Function} escaper
 */
function paramEscape(params, escaper) {
  if (typeof params !== 'object') {
    return params;
  }
  if (typeof escaper !== 'function') {
    throw new Error('escaper must be function');
  }
  const escapedParams = {};
  Object.keys(params).forEach(key => {
    escapedParams[key] = escaper(params[key]);
  });
  return escapedParams;
}

/**
 * Reture options combined with xss default configurations
 * @param {Object} options
 */
function generateOptions(options) {
  const { enableStyle, whiteList } = options;
  const combinedWhiteList = {
    ...xss.whiteList,
    ...whiteList
  }
  if (enableStyle) {
    Object.keys(combinedWhiteList).forEach(key => combinedWhiteList[key].push('style'));
  }
  // Clear options defined by middleware which is not required by xss filter
  const filteredOptions = {};
  Object.keys(options)
    .filter(option => filterOptions.indexOf(option) === -1)
    .forEach(item => {
      filteredOptions[item] = options[item];
    });
  return {
    whiteList: combinedWhiteList,
    ...filteredOptions
  };
}

function xssMiddleware(options = {}) {
  const xssInstance = new xss.FilterXSS(generateOptions(options));
  return async (ctx, next) => {
    const { query, request } = ctx;
    const { body } = request;
    const escaper = xssInstance.process.bind(xssInstance);
    ctx.query = paramEscape(query, escaper);
    ctx.request.body = paramEscape(body, escaper);
    await next();
  };
}

export default xssMiddleware;