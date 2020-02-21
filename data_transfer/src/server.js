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
    return `<H1 id="hello-world">Hello World from ${process.env.HOST_NAME}!</H1>
    <p>Fake a sign in via IDM <a href="${process.env.IDM_HOST}?redirect_path=/redirect_path">here...</a></p>
    `
  }
})

server.route({
  method: 'GET',
  path: '/redirect_path',
  handler: (request, h) => {
    return `
      <h1>You just came back from IDM (mock)</h1>
      <pre>
${JSON.stringify(request.query, ' ', 2)}
      </pre>
    `
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
