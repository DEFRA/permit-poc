'use strict'

const { BlobServiceClient } = require('@azure/storage-blob')

async function main() {
    console.log('Azure Blob storage v12 - JavaScript quickstart sample');
    // Quick start code goes here
}

main()
  .then(() => {
    console.log('Done!!!!')
    process.exit(0)
  })
  .catch((ex) => {
    console.error(ex.message)
    process.exit(1)
  })
