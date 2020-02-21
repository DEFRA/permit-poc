'use strict'

const { BlobServiceClient, StorageSharedKeyCredential } = require("@azure/storage-blob")
const {promisify} = require('util')

async function main() {
    console.log('Azure Blob storage v12 - JavaScript quickstart sample');
    // Quick start code goes here
}

main()
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
  .catch((ex) => {
    console.error(ex.message)
    process.exit(1)
  })
