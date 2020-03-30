// TODO: If the user deletes all files then presses submit without uploading any
// more, a "you must upload a file" error is displayed, but because the files
// list is only updated on successful submit the files will all reappear on the
// page.

// TODO: Allow file extensions to be passed through from yaml

// TODO: Allow custom content to be displayed as specified in yaml

const Application = require('../../dao/application')
const Joi = require('@hapi/joi')
const failWith = require('../../utils/validation')
const view = 'upload/upload.view.njk'
const Hoek = require('@hapi/hoek')
const Bourne = require('@hapi/bourne')

const { getCurrent } = require('hapi-govuk-journey-map')

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

// We define this in a function so we can pass it to failAction
const getPageHeading = async (request) => {
  const route = await getCurrent(request)
  return route.parent.options.title
}

const getUploadedFiles = async (request) => {
  // Get the current list of files (defaulting to an empty array)
  const { files = [] } = await Application.get(request)
  const filetype = await getFiletype(request)

  // Filter and return the list of files to just those matching the desired filetype
  return files.filter(file => file.filetype === filetype)
}

// We define this in a function so we can pass it to failAction
const getFiletype = async (request) => {
  const route = await getCurrent(request)
  return route.parent.options.filetype
}

// MOJ multi-file upload component expects file list to be in a specific format
const getFormattedFiles = async (request) => {
  const fileList = await getUploadedFiles(request)

  return fileList.map(item => ({
    fileName: item.id,
    originalFileName: item.filename,
    message: {
      html: getSuccessHtml({ messageHtml: item.filename })
    },
    deleteButton: {
      text: 'Delete'
    }
  }))
}

// Lifted directly from moj-frontend/src/moj/components/multi-file-upload/multi-file-upload.js
const getSuccessHtml = function (success) {
  return '<span class="moj-multi-file-upload__success"> <svg class="moj-banner__icon" fill="currentColor" role="presentation" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25" height="25" width="25"><path d="M25,6.2L8.7,23.2L0,14.1l4-4.2l4.7,4.9L21,2L25,6.2z"/></svg> ' + success.messageHtml + '</span>'
}

module.exports = [{
  method: 'GET',
  handler: async function (request, h) {
    return h.view(view, {
      pageHeading: await getPageHeading(request),
      uploadedFiles: await getFormattedFiles(request),
      formOptions: 'enctype="multipart/form-data"'
    })
  }
}, {
  method: 'POST',
  handler: async function (request, h) {
    // Parse the JSON file list we've been passed
    const fileList = (request.payload.files)
    const filetype = await getFiletype(request)

    // Add the filetype to each one
    fileList.forEach(file => { file.filetype = filetype })

    // Get the current list of files (defaulting to an empty array)
    const { files = [] } = await Application.get(request)

    // Filter out files with the current filetype so we can replace them with
    // the current set of files of that filetype
    const filteredFiles = files.filter(file => file.filetype !== filetype)

    // Merge the uploaded files
    Hoek.merge(filteredFiles, fileList)

    // Save the list back
    await Application.update(request, { files: filteredFiles })

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
      failAction: failWith(view, {
        pageHeading: getPageHeading,
        uploadedFiles: getFormattedFiles,
        formOptions: 'enctype="multipart/form-data"'
      }, {
        files: {
          'array.min': 'You must upload a file'
        }
      })
    }
  }
}]
