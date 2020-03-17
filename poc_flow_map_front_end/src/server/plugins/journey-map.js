const Cache = require('../utils/cache')

const { resolve } = require('path')

module.exports = {
  plugin: require('hapi-govuk-journey-map'),
  options: {
    modulePath: resolve(`${process.cwd()}/src/server/modules`),
    setQueryData: (request, data) => Cache.update(request, 'QueryData', { ...data }),
    getQueryData: (request) => Cache.get(request, 'QueryData')
  }
}
