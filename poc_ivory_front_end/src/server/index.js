const dotenv = require('dotenv')
dotenv.config() // Load variables from .env before any other code

const hapi = require('@hapi/hapi')
const { name, version } = require('../../package')
const { logger } = require('defra-logging-facade')

const port = process.env.PORT || 3000
const host = process.env.HOST_NAME
const phase = process.env.PHASE

const serverOptions = {
  port: port,
  host: host,
  routes: {
    validate: {
      options: {
        abortEarly: false
      }
    }
  }
}

async function registerPlugins (server) {
  await server.register([
    require('@hapi/inert'),
    require('./plugins/frontend'),
    require('./plugins/question-page'),
    require('./plugins/version'),
    require('./plugins/flow'),
    require('./plugins/robots'),
    require('./plugins/cache'),
    require('./plugins/navigation'),
    require('./plugins/error-pages'),
    require('./plugins/crumb'),
    // require('./plugins/log-application-data'),
    require('./plugins/logging'),
    require('blipp')
  ])
}

function startHandler (server) {
  logger.info(`${name} (${version}) is starting...`)

  // listen on SIGTERM signal and gracefully stop the server
  process.on('SIGTERM', function () {
    logger.info('Received SIGTERM scheduling shutdown...')
    logger.info(`${name} (${version}) is stopping...`)

    server.stop({ timeout: 10000 }).then(function (err) {
      logger.info('Shutdown complete')
      process.exit((err) ? 1 : 0)
    })
  })
}

async function createServer () {
  // Create the hapi server
  const server = hapi.server(serverOptions)

  server.app.phase = phase
  server.app.loginEnabled = {
    signInLink: '/login',
    signOutLink: '/logoff'
  }

  // Register the plugins
  await registerPlugins(server)

  server.events.on('start', () => startHandler(server))

  return server
}

module.exports = createServer
