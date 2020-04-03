const { logger } = require('defra-logging-facade')

const isDev = process.env.NODE_ENV === 'development'

const contact = {
  message: 'contact the permitting helpline',
  link: '#'
}

module.exports = {
  plugin: {
    name: 'request-errors',
    register: async (server, options = {}) => {
      const { contactMessage = contact.message, contactLink = contact.link } = options
      server.ext('onPreResponse', async (request, h) => {
        const response = request.response

        if (response.isBoom) {
          // An error was raised during
          // processing the request
          const statusCode = response.output.statusCode

          switch (statusCode) {
            case 403:
            case 404: {
              const pageHeading = 'Page not found'
              return h.view('errors/error-404.njk',
                { statusCode, pageHeading, contactMessage, contactLink }).code(statusCode)
            }
            default: {
              const pageHeading = 'Sorry, there is a problem with the service'
              const { data, message, stack } = response
              const devDetails = { statusCode, data, message }
              logger.error(devDetails)

              // log an error to airbrake/errbit - the response object is actually an instanceof Error
              logger.serverError(response, request)

              // Then return the `500` view (HTTP 500 Internal Server Error )
              return h.view('errors/error-500.njk', {
                statusCode: 500,
                pageHeading,
                contactMessage,
                contactLink,
                devDetails,
                stack: stack.replace(/\\n|\\r\\n|\\r/g, '<br/>'),
                isDev
              }).code(500)
            }
          }
        }
        return h.continue
      })
    }
  }
}
