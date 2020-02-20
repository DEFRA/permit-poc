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
    const token = process.env.TOKEN
    const redirectPath = 'http://'
      + process.env.REDIRECT_HOST
      + (request.query['redirect_path'] || '/login')
    return `<H1>Hello please login using you "IDM" details</H1>
      <form action="${redirectPath}" method="GET">
        User ID: <input name="user_id" value="" />
        <input name="access_token" type='hidden' value="${token}" />
        <input type="submit" value="submit" />
      </form>
      Details:
      <ul>
        <li>redirectPath: ${redirectPath}</li>
        <li>HOST_NAME: ${process.env.HOST_NAME}!</li>
        <li>ENV:<pre>${JSON.stringify(process.env, ' ', 2)}</pre></li>
        <li>server,info: <pre>${JSON.stringify(server.info, ' ', 2)}</pre></li>
        <li>query params: <pre>${JSON.stringify(request.query, ' ', 2)}</pre></li>
      </ul>
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
