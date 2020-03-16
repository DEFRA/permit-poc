const Boom = require('@hapi/boom')
const { BlobServiceClient } = require('@azure/storage-blob')
const Ajv = require('ajv')
const { logger } = require('defra-logging-facade')
const { AZURE_STORAGE_CONNECTION_STRING, BLOB_CONTAINER_NAME } = process.env
const Application = require('../../dao/application.js')
const schema = require('../../../basic.partial.application.schema.json')

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

async function sendToDynamics (obj, label) {
  const content = JSON.stringify(obj)

  const blobServiceClient = await BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING)
  const containerClient = blobServiceClient.getContainerClient(BLOB_CONTAINER_NAME)
  const blobName = label + new Date().getTime()
  const blockBlobClient = containerClient.getBlockBlobClient(blobName)
  const uploadResult = await blockBlobClient.upload(content, content.length)
  logger.info(`Upload block blob successfully: ${uploadResult.requestId}`)
}

function validateMessage (message) {
  const ajv = new Ajv()
  const validate = ajv.compile(schema)
  return validate(message)
}

async function transferData (message) {
  try {
    logger.info('Validating message...')
    if (validateMessage(message)) {
      logger.info('Message valid')
      // await sendToDynamics(schema, 'schema')
      // logger.info('SUCCESS, SCHEMA SENT')
      logger.info('Sending message...')
      await sendToDynamics(message, 'message')
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
