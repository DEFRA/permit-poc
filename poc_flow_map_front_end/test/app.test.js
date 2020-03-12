'use strict'

const Lab = require('@hapi/lab')
const { expect } = require('@hapi/code')
const { DOMParser } = require('xmldom')
const { afterEach, beforeEach, describe, it } = exports.lab = Lab.script()
const { init } = require('../src/server')

const getRequest = {
  method: 'get',
  url: '/'
}

describe('GET /', () => {
  let server

  beforeEach(async () => {
    server = await init()
  })

  afterEach(async () => {
    await server.stop()
  })

  it('responds with 200', async () => {
    const res = await server.inject(getRequest)

    expect(res.statusCode).to.equal(200)
  })

  it('responds with Hello World text', async () => {
    const res = await server.inject(getRequest)

    const parser = new DOMParser()
    const content = parser.parseFromString(res.payload, 'text/html')

    expect(content.getElementById('hello-world').firstChild.nodeValue).to.contain('Hello World from ')
  })
})
