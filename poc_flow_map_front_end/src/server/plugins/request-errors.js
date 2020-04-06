const Boom = require('@hapi/boom')
const { logger } = require('defra-logging-facade')
const Application = require('../dao/application')
const { getQueryData, getCurrent, isJourneyRoute, getRoute } = require('hapi-govuk-journey-map')

const isDev = process.env.NODE_ENV === 'development'

const contact = {
  message: 'contact the permitting helpline',
  link: '#'
}

async function getStartLink () {
  const { path = '/' } = await getRoute('home')
  return path
}

module.exports = {
  plugin: {
    name: 'request-errors',
    register: async (server, options = {}) => {
      const { contactMessage = contact.message, contactLink = contact.link } = options

      server.ext('onPreAuth', async (request, h) => {
        if (request.path !== await getStartLink() && isJourneyRoute(request)) {
          const application = await Application.get(request)
          if (application === null) {
            return Boom.boomify(new Error('SessionTimeout'), { statusCode: 440 })
          }
        }
        return h.continue
      })

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
              return h.view('errors/error-404.njk', { statusCode, pageHeading, contactMessage, contactLink }).code(statusCode)
            }
            case 440: {
              const pageHeading = 'Your application has timed out'
              return h.view('errors/error-440.njk', { statusCode, pageHeading, startLink: await getStartLink() }).code(statusCode)
            }
            default: {
              const pageHeading = 'Sorry, there is a problem with the service'
              const { data, message, stack } = response
              const devDetails = { statusCode, data, message }
              logger.error(devDetails)

              // log an error to airbrake/errbit - the response object is actually an instanceof Error
              logger.serverError(response, request)

              const viewData = {
                statusCode: 500,
                pageHeading,
                contactMessage,
                contactLink,
                isDev
              }

              if (isDev) {
                Object.assign(viewData, {
                  devDetails,
                  stack: stack.replace(/\\n|\\r\\n|\\r/g, '<br/>'),
                  application: await Application.get(request),
                  queryData: await getQueryData(request),
                  route: getCurrent(request)
                })
              }

              // Then return the `500` view (HTTP 500 Internal Server Error )
              return h.view('errors/error-500.njk', viewData).code(500)
            }
          }
        }
        return h.continue
      })
    }
  }
}
