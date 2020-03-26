// TODO: Pull the filetype for the files list from the map.yaml
// TODO: Populate uploadedFiles on page load (by searching files list for filetype?)

const Application = require('../../dao/application')
const Joi = require('@hapi/joi')
const failWith = require('../../utils/validation')
const view = 'upload/upload.view.njk'
const Hoek = require('@hapi/hoek')
const Bourne = require('@hapi/bourne')

const pageHeading = 'Upload a file'

// As of v16 Joi no longer parses JSON arrays
// So we extend Joi to do this ourselves
const coerceArrayJoi = Joi.extend((joi) => {
  return {
    type: 'array',
    base: Joi.array(),
    coerce: {
      from: 'string',
      method (value, helpers) {
        if (value[0] !== '[') { return }

        try {
          return { value: Bourne.parse(value) }
        } catch (ignoreErr) { }
      }
    }
  }
})

module.exports = [{
  method: 'GET',
  handler: async function (request, h) {
    const { files = [] } = await Application.get(request)
    const uploadedFiles = files
    return h.view(view, { pageHeading, uploadedFiles, formOptions: 'enctype="multipart/form-data"' })
  }
}, {
  method: 'POST',
  handler: async function (request, h) {
    // Parse the JSON file list we've been passed
    const fileList = (request.payload.files)

    // Add the filetype to each one
    fileList.forEach((file) => { file.filetype = 'POC demo file' })

    // Get the current list of files (defaulting to an empty array)
    const { files = [] } = await Application.get(request)

    // Merge the uploaded files
    Hoek.merge(files, fileList)

    // Save the list back
    await Application.update(request, { files })

    return h.continue
  },
  options: {
    payload: {
      parse: true
    },
    validate: {
      payload: Joi.object({
        files: coerceArrayJoi.array().min(1)
      }).options({ allowUnknown: true, convert: true }),
      failAction: failWith(view, { pageHeading }, {
        files: {
          'array.min': 'You must upload a file'
        }
      })
    }
  }
}]
