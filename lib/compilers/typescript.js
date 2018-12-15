var ensureRequire = require('../ensure-require.js')
var assign = require('object-assign')

module.exports = function (raw, cb, compiler, filePath) {
  ensureRequire('ts', ['typescript'])

  try {
    var ts = require('typescript')
    var babel = require('@babel/core')
    var res = ts.transpileModule(raw, {
      compilerOptions: {
        module: ts.ModuleKind.ESNext
      }
    })

    var options = assign(
      {
        comments: false,
        filename: filePath,
        sourceMaps: compiler.options.sourceMap
      },
      {
        presets: ['@babel/env'],
        plugins: [
          [
            '@babel/plugin-transform-runtime',
            {
              corejs: false,
              helpers: false,
              regenerator: true,
              useESModules: false
            }
          ]
        ]
      }
    )
    var out = babel.transform(res.outputText, options)
  } catch (err) {
    return cb(err)
  }
  cb(null, out)
}
