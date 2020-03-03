const Glob = require('glob')

module.exports = Glob.sync('**/*route*.js', { cwd: __dirname })
