const Application = require('../../dao/application.js')
const { BlobServiceClient, StorageSharedKeyCredential } = require('@azure/storage-blob')
const Ajv = require('ajv')
const { logger } = require('defra-logging-facade')

const schema = require('../../../basic.partial.application.schema.json')

class TransferDataHandlers extends require('defra-hapi-handlers') {
  async handleGet (request, h, errors) {
    const application = await Application.get(request)
    const nextPath = await this.getNextPath(request)

    await transferData(application)

    return h.redirect(nextPath)
  }
}

async function sendToDynamics (obj, label) {
  const content = JSON.stringify(obj)

  const blobServiceClient = await BlobServiceClient
    .fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING)
  const containerName = process.env.BLOB_CONTAINER_NAME
  const containerClient = blobServiceClient.getContainerClient(containerName)
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
  }
}

module.exports = TransferDataHandlers
