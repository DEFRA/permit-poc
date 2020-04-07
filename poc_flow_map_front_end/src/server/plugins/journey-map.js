const Cache = require('../utils/cache')

const isDev = process.env.NODE_ENV === 'development'

const { resolve } = require('path')

module.exports = {
  plugin: require('hapi-govuk-journey-map'),
  options: {
    modulePath: resolve(`${process.cwd()}/src/server/modules`),
    setQueryData: (request, data) => Cache.update(request, 'QueryData', { ...data }),
    getQueryData: (request) => Cache.get(request, 'QueryData'),
    journeyMapPath: isDev && '/journey-map'
  }
}
