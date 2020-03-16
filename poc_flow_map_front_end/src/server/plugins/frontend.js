const pkg = require('../../../package.json')

module.exports = {
  plugin: require('hapi-govuk-frontend'),
  options: {
    assetPath: '/assets',
    assetDirectories: ['public/static', 'public/build'],
    serviceName: 'Front end template demo',
    viewPath: 'src/server/modules',
    includePaths: [
      'node_modules/hapi-govuk-frontend/node_modules/govuk-frontend',
      'node_modules/@ministryofjustice/frontend'
    ],
    context: {
      appVersion: pkg.version
    }
  }
}
