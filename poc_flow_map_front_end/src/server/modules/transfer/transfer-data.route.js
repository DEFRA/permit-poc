const Boom = require('@hapi/boom')
const { logger } = require('defra-logging-facade')
const Application = require('../../dao/application.js')
const schema = require('../../../basic.partial.application.schema.json')

const { sendToDynamics, validateMessage } = require('../../utils/transfer')

module.exports = {
  method: 'GET',
  handler: async function (request, h) {
    const application = await Application.get(request)
    const err = await transferData(application)
    if (err) {
      return Boom.boomify(err)
    }
    return h.continue
  }
}

async function transferData (message) {
  try {
    logger.info('Validating message...')
    if (validateMessage(message, schema)) {
      logger.info('Message valid')
      // const schemaObj = JSON.stringify(schema)
      // await sendToDynamics(schemaObj, 'schema')
      // logger.info('SUCCESS, SCHEMA SENT')
      logger.info('Sending message...')
      const messageObj = JSON.stringify(message)
      await sendToDynamics(messageObj, 'message')
      logger.info('Message sent')
      logger.info(message)
    } else {
      logger.error('Invalid message')
    }
  } catch (e) {
    logger.error(e)
    return e
  }
}
