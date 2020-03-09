'use strict'

const { BlobServiceClient, StorageSharedKeyCredential } = require("@azure/storage-blob")
const Ajv = require("ajv")
const schema = require("./partial.application.json")
const message = require("./basic.partial.application.schema.json")

async function sendToDynamics(obj, label) {
  const content = JSON.stringify(obj)

  const blobServiceClient = await BlobServiceClient
    .fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING)
  const containerName = process.env.BLOB_CONTAINER_NAME
  const containerClient = blobServiceClient.getContainerClient(containerName)
  const blobName = label + new Date().getTime();
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  const uploadResult = await blockBlobClient.upload(content, content.length)
  console.log(`Upload block blob successfully`, uploadResult.requestId);

}

function validateMessage() {
  const ajv = new Ajv()
  const validate = ajv.compile(schema)
  return validate(message)
}

async function main() {
    console.log('ATTEMPT TO VALIDATE USING JSON_SCHEMA AND SEND TO DYNAMICS')
    try {
      if (validateMessage()) {
        console.log('SUCESS, MESSAGE VALID')
        await sendToDynamics(schema, 'schema')
        await sendToDynamics(message, 'message')
        console.log('SUCCESS, SCHEMA AND MESSAGE SENT')
        process.exit(0)
      } else {
        console.error('Invalid message')
        process.exit(1)
      }
    } catch(e) {
      console.error(e)
      process.exit(1)
    }
}

main()
