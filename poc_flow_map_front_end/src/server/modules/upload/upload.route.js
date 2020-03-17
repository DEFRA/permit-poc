const Application = require('../../dao/application')
// const Joi = require('@hapi/joi')
// const failWith = require('../../utils/validation')
const view = 'upload/upload.njk'

module.exports = [{
  method: 'GET',
  handler: async function (request, h) {
    // TODO: Get current uploaded files
    return h.view(view, { pageHeading: 'Upload a file' })
  }
}, {
  method: 'POST',
  handler: async function (request, h) {
    console.log(request)

    // TODO: use utils/transfer#sendToDynamics to send file to Dynamics

    // TODO: save Dynamics blobName to application, eg:
    // {
    //   files: [
    //     { id: 'file blobName...'},
    //     { id: 'file blobName...'}
    //   ], etc...
    // }
    
    // TODO: Loop back while user wants to upload more files

    return h.continue
  },
  options: {
    // validate: {
    //   payload: Joi.object({
    //     ...
    //   }),
    //   failAction: failWith(view, {
    //     ...
    //   })
    // }
  }
}]
