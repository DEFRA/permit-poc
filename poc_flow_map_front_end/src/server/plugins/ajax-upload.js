const { sendToDynamics, deleteFromDynamics } = require('../utils/transfer')

const uploadRoute = {
  method: 'POST',
  path: '/ajax-upload',
  handler: async function (request, h) {
    // TODO: Refactor this so that it shares code with upload.route.js
    // Not sure if best place for upload function is here (in plugin) or utils/transfer.js

    // Get the uploaded documents
    const { documents } = request.payload

    // The upload comes to us as a Readable stream object
    const data = documents.read()
    const sendResult = await sendToDynamics(data, 'file')

    // Extract the needed metadata
    const { blobName: id } = sendResult
    const { filename } = documents.hapi

    const successMessage = `${filename} has been uploaded`

    const response = {
      file: {
        originalname: filename,
        filename: id
      },
      success: {
        messageHtml: successMessage,
        messageText: successMessage
      }
    }

    return response
  },
  options: {
    payload: {
      parse: true,
      output: 'stream',
      allow: 'multipart/form-data',
      multipart: true
    }
    // validate: {
    //   payload: Joi.object({
    //     documents: {
    //       hapi: {
    //         filename: Joi.string().required()
    //       }
    //     }
    //   }).options({ allowUnknown: true }),
    //   failAction: failWith(view, { pageHeading }, {
    //     documents: {
    //       'string.empty': 'You must upload a file'
    //     }
    //   })
    // }
  }
}

const deleteRoute = {
  method: 'POST',
  path: '/ajax-delete',
  handler: async function (request, h) {
    const { delete: blobName } = request.payload
    const deleteResult = await deleteFromDynamics(blobName)

    // Return error message if deletion fails
    if (deleteResult.errorCode) {
      return { error: 'Could not delete file' }
    }

    // Component expects {} to be returned if deletion succeeds
    return {}
  }
}

// Expose plugin
module.exports = {
  plugin: {
    name: 'ajax-upload',
    register: (server) => {
      server.route(uploadRoute)
      server.route(deleteRoute)
    }
  }
}
