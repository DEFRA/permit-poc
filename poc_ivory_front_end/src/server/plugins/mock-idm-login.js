const { logger } = require('defra-logging-facade')

module.exports = {
  plugin: {
    name: 'mock-idm-login',
    register: (server) => {
      server.route({
        method: 'GET',
        path: '/idm/login',
        handler: async (request, h) => {
          const returnUrl = request.query.returnUrl + '?userId=895419cc-a8bb-4c77-b26f-89e04a96f265'
          logger.info(`MOCK-IDM: User logged in, redirecting to ${returnUrl}`)
          return h.redirect(returnUrl)
        },
        options: {
          tags: ['always', 'skip-log-application-data']
        }
      })
    }
  }
}
