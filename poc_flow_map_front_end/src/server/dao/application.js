const { logger } = require('defra-logging-facade')
const Cache = require('../utils/cache')
const key = 'Application'

module.exports = class Application {
  static async get (request) {
    return Cache.get(request, key)
  }

  static async set (request, data) {
    return Cache.set(request, key, data)
  }

  static async update (request, val) {
    const application = await Application.get(request, key)

    const hasChanged = (propName) => {
      return val[propName] && val[propName] !== application[propName]
    }

    // Reset invalid data if permit type changes
    if (hasChanged('permitType')) {
      delete application.facilityType
      delete application.permitCategory
      delete application.standardRule
    }

    // Reset invalid data if permit category changes
    if (hasChanged('permitCategory')) {
      delete application.standardRule
    }

    // Overwrite the application data
    await Application.set(request, { ...application, ...val })

    // Log and return the resulting application data
    const result = await Application.get(request)
    logger.debug('Application: ', result)
    return result
  }
}
