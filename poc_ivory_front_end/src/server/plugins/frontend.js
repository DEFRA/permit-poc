const pkg = require('../../../package')

module.exports = {
  plugin: require('hapi-govuk-frontend'),
  options: {
    assetPath: '/assets',
    assetDirectories: ['public/static', 'public/build'],
    serviceName: 'Front end template demo',
    viewPath: 'src/server/modules',
    context: {
      appVersion: pkg.version
    }
  }
}
