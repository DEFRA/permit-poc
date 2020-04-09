const pkg = require('../../../package.json')

module.exports = {
  plugin: require('hapi-govuk-frontend'),
  options: {
    assetPath: '/assets',
    assetDirectories: ['public/static', 'public/build'],
    serviceName: process.env.SERVICE_NAME,
    viewPath: 'src/server/modules',
    includePaths: [
      'node_modules/@ministryofjustice/frontend',
      'node_modules/@envage/hapi-govuk-question-page'
    ],
    context: {
      appVersion: pkg.version
    }
  }
}
