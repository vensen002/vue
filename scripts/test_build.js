let builds = require('./config').getAllBuilds()
let buildsKeys = require('./config').getAllBuildsKeys()

// console.log(builds)
console.log(buildsKeys)
/*
[
  'runtime-cjs-dev',
  'runtime-cjs-prod',
  'full-cjs-dev',
  'full-cjs-prod',
  'runtime-esm',
  'full-esm',
  'full-esm-browser-dev',
  'full-esm-browser-prod',
  'runtime-dev',
  'runtime-prod',
  'full-dev',
  'full-prod',
  'compiler',
  'compiler-browser',
  'server-renderer-dev',
  'server-renderer-prod',
  'server-renderer-basic',
  'server-renderer-webpack-server-plugin',
  'server-renderer-webpack-client-plugin',
  'compiler-sfc'
]
*/

