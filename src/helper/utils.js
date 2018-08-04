const NODE_ENV = process.env.NODE_ENV;
const mapPathConfig = {
  server: {
    development: 'server',
    production: 'server_dist'
  }
};

function pathConfig(path) {
  if (!mapPathConfig[path]) {
    throw new Error('Invalid path');
  }
  return mapPathConfig[path][NODE_ENV];
}

export {
  pathConfig
};
