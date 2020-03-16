const { BlobServiceClient } = require('@azure/storage-blob')
const Ajv = require('ajv')
const { logger } = require('defra-logging-facade')

const { AZURE_STORAGE_CONNECTION_STRING, BLOB_CONTAINER_NAME } = process.env

async function sendToDynamics (content, label) {
  const blobServiceClient = await BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING)
  const containerClient = blobServiceClient.getContainerClient(BLOB_CONTAINER_NAME)
  const blobName = label + new Date().getTime()
  const blockBlobClient = containerClient.getBlockBlobClient(blobName)
  const uploadResult = await blockBlobClient.upload(content, content.length)
  logger.info(`Upload block blob successfully: ${uploadResult.requestId}`)
}

function validateMessage (message, schema) {
  const ajv = new Ajv()
  const validate = ajv.compile(schema)
  return validate(message)
}

module.exports = { sendToDynamics, validateMessage }
