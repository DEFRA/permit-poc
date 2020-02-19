const Boom = require('@hapi/boom')
const Application = require('../dao/application')

module.exports = {
  plugin: {
    name: 'navigation',
    register: (server) => {
      server.ext('onPostAuth', async (request, h) => {
        const { settings } = request.route
        const { tags = [] } = settings
        const application = await Application.get(request)

        // Always allow the following to continue
        if (tags.includes('always')) {
          return h.continue
        }

        // Always redirect to home if there is no application
        if (!application) {
          return Boom.preconditionFailed('Application doesn\'t exist yet')
        }

        // Check submitted tag
        if (tags.includes('submitted')) {
          if (application.status !== 'submitted') {
            return Boom.notFound()
          }
        } else {
          const { status, applicationNumber } = application
          if (status === 'submitted') {
            return Boom.preconditionFailed('Application already submitted', { applicationNumber })
          }
        }

        return h.continue
      })
    }
  }
}
