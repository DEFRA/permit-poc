const Glob = require('glob')

module.exports = Glob.sync('**/*plugin*.js', { cwd: __dirname })
