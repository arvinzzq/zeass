'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var NODE_ENV = process.env.NODE_ENV;
var mapPathConfig = {
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

exports.pathConfig = pathConfig;