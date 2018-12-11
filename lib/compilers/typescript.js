var ensureRequire = require('../ensure-require.js')
var fs = require('fs')
var path = require('path')
var json = require('json5')

var defaulttsOptions = {
  'compilerOptions': {
    'target': 'esnext',
    'strict': true,
    'module': 'esnext',
    'moduleResolution': 'node'
  }
}

var tsconfigPath = path.resolve(process.cwd(), 'tsconfig.json')
var tsOptions = fs.existsSync(tsconfigPath) ? getTsconfig() || defaulttsOptions : defaulttsOptions

function getTsconfig () {
  var rc
  try {
    rc = json.parse(fs.readFileSync(tsconfigPath))
  } catch (e) {
    throw new Error('[vueify] Your tsconfig.json seems to be incorrectly formatted.')
  }
  return rc
}

module.exports = function (raw, cb, compiler) {
  ensureRequire('ts', ['typescript'])

  try {
    var ts = require('typescript')
    var res = ts.transpileModule(raw, tsOptions)
  } catch (err) {
    return cb(err)
  }
  cb(null, res)
}
