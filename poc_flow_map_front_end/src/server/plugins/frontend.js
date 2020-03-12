const pkg = require('../../../package.json')

module.exports = {
  plugin: require('hapi-govuk-frontend'),
  options: {
    assetPath: '/assets',
    assetDirectories: ['public/static', 'public/build'],
    serviceName: 'Front end template demo',
    viewPath: 'node_modules/@envage/hapi-govuk-question-page',
    includePaths: [
      'node_modules/hapi-govuk-frontend/node_modules/govuk-frontend',
      'node_modules/@ministryofjustice/frontend'
    ],
    context: {
      appVersion: pkg.version
    }
  }
}
