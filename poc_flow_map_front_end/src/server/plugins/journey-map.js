const Cache = require('../utils/cache')

const isDev = process.env.NODE_ENV === 'development'
const journeyMapAsJson = process.env.JOURNEY_MAP_AS_JSON === 'true'

const { resolve } = require('path')

module.exports = {
  plugin: require('hapi-govuk-journey-map'),
  options: {
    modulePath: resolve(`${process.cwd()}/src/server/modules`),
    setQueryData: (request, data) => Cache.update(request, 'QueryData', { ...data }),
    getQueryData: (request) => Cache.get(request, 'QueryData'),
    journeyMapPath: isDev && '/journey-map',
    journeyMapView: !journeyMapAsJson && 'journey-map/journey-map.view.njk'
  }
}
