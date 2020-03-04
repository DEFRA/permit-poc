const Application = require('../dao/application')
const { logger } = require('defra-logging-facade')

module.exports = {
  plugin: {
    name: 'log-application-data',
    register: (server) => {
      server.ext('onPreResponse', async (request, h) => {
        const { pathname } = request.url
        if (['favicon.ico', 'assets', 'login'].includes(pathname.split('/')[1])) {
          return h.continue
        }

        const { settings } = request.route
        const { tags = [] } = settings

        if (tags.includes('skip-log-application-data')) {
          return h.continue
        }

        const application = await Application.get(request)
        logger.debug(`Application data: ${JSON.stringify(application)}`)
        return h.continue
      })
    }
  }
}
