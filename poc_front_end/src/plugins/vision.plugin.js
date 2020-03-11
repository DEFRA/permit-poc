const Nunjucks = require('nunjucks')

module.exports = {
  plugin: require('@hapi/vision'),
  options: {
    engines: {
      njk: {
        compile: (src, options) => {
          const template = Nunjucks.compile(src, options.environment)

          return (context) => {
            return template.render(context)
          }
        },
        prepare: (options, next) => {
          options.compileOptions.environment = Nunjucks.configure(['node_modules/govuk-frontend', 'src/page-template', ...options.path], {
            autoescape: true,
            watch: false
          })

          return next()
        }
      }
    },
    path: [
      'node_modules/@envage/hapi-govuk-question-page'
    ],
    isCached: false,
    context: {
      appVersion: '0.0.1',
      assetPath: '/assets',
      serviceName: 'Apply for an environmental permit',
      pageTitle: 'Simple question page - GOV.UK',
      analyticsAccount: undefined
    }
  }
}
