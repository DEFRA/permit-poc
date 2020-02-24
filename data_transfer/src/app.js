'use strict'

const { BlobServiceClient, StorageSharedKeyCredential } = require("@azure/storage-blob")
const Ajv = require("ajv")
const schema = require("./hello.schema.json")
const message = require("./hello.message.json")

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

async function main() {
    console.log('Azure Blob storage v12 - JavaScript quickstart sample');
    // Quick start code goes here
}

main()
  /*
  .then(async () => {
    console.log('BLOB_CONTAINER_NAME:', process.env.BLOB_CONTAINER_NAME)
    console.log('AZURE_STORAGE_CONNECTION_STRING:', process.env.AZURE_STORAGE_CONNECTION_STRING)
    console.log()

    const blobServiceClient = await BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING)

    console.log(blobServiceClient)
    console.log('=========')
    const containerName = process.env.BLOB_CONTAINER_NAME
    const containerClient = blobServiceClient.getContainerClient(containerName)
    const content = "Hello world!";
    const blobName = "newblob" + new Date().getTime();
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    console.log(blockBlobClient)
    console.log('=========')
    return blockBlobClient.upload(content, content.length)

  })
  .then(uploadBlobResponse => {
    console.log('*******')
    console.log(`Upload block blob successfully`, uploadBlobResponse.requestId);
    //for await (const blob of iter) {
    //  console.log(`Blob ${i++}: ${blob.name}`)
    //}
    process.exit(0)
  })
  */
  .then(async () => {
    const ajv = new Ajv()
    const validate = ajv.compile(schema)
    if (validate(message)) {
      console.log('SUCESS, MESSAGE VALID')
      await sendToDynamics(schema, 'schema')
      await sendToDynamics(message, 'message')
      process.exit(0)
    } else {
      console.error('FAIL, INVALID MESSAGE')
      process.exit(1)
    }
  })
  .catch((ex) => {
    console.error(ex.message)
    process.exit(1)
  })
