const Application = require('../../dao/application')
// const Joi = require('@hapi/joi')
// const failWith = require('../../utils/validation')
const view = 'upload/upload.view.njk'
const { sendToDynamics } = require('../../utils/transfer')
const { logger } = require('defra-logging-facade')

module.exports = [{
  method: 'GET',
  handler: async function (request, h) {
    // formOptions is set so we can pass through the required parameter for an upload form
    return h.view(view, { pageHeading: 'Upload a file', formOptions: 'enctype="multipart/form-data"' })
  }
}, {
  method: 'POST',
  handler: async function (request, h) {
    const { upload } = request.payload
    const data = upload.read()
    const sendResult = await sendToDynamics(data, 'file')

    const { blobName: id } = sendResult
    const filetype = 'POC demo file'
    const { filename } = upload.hapi

    const files = [{ id, filetype, filename }]

    await Application.update(request, { files })

    // TODO: Allow multiple files and loop back while user wants to upload more files
    // TODO: Change over to MOJ multi file upload component

    return h.continue
  },
  // TODO: Maybe add some basic validation
  options: {
    payload: {
      parse: true,
      output: 'stream',
    }
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
