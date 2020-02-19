'use strict'

const Hapi = require('@hapi/hapi')
const OS = require('os')

const Assets = require('./assets')
const Routes = require('./routes')
const Plugins = require('./plugins')

const server = Hapi.server({
  port: 3000,
  host: process.env.HOST_NAME
})

exports.init = async () => {
  await server.initialize()
  return server
}

exports.start = async () => {
  // Register the plugins
  await Promise.all(Plugins.map(async filename => {
    await server.register(require('./plugins/' + filename))
  }))

  // Set up static assets
  server.route(Assets)

  // Register the routes
  await Promise.all(Routes.map(async filename => {
    await server.route(require('./routes/' + filename))
  }))

  // Start server
  await server.start()
  console.log(`Server running at: ${server.info.uri}`)
  return server
}

process.on('unhandledRejection', (err) => {
  console.log(err)
  process.exit(1)
})
