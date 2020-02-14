'use strict'

const Hapi = require('@hapi/hapi')
const OS = require('os')

const server = Hapi.server({
  port: 3000,
  host: process.env.HOST_NAME
})

server.route({
  method: 'GET',
  path: '/',
  handler: (request, h) => {
    return `<p id='hello-world'>Hello World from ${process.env.HOST_NAME}!<br>${JSON.stringify(process.env)}</p><br>${JSON.stringify(server.info)}`
  }
})

exports.init = async () => {
  await server.initialize()
  return server
}

exports.start = async () => {
  await server.start()
  console.log(`Server running at: ${server.info.uri}`)
  return server
}

process.on('unhandledRejection', (err) => {
  console.log(err)
  process.exit(1)
})
