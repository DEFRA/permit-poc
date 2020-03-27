const Hoek = require('@hapi/hoek')

const mapErrorsForDisplay = (details, messages) => {
  return {
    titleText: 'Fix the following errors',
    errorList: details.map(err => {
      const name = err.path[0]
      const message = (messages[name] && messages[name][err.type]) || err.message

      return {
        href: `#${name}`,
        name: name,
        text: message
      }
    })
  }
}

function formatErrors (result, messages) {
  const errorSummary = mapErrorsForDisplay(result.details, messages)
  const errors = {}
  if (errors) {
    errorSummary.errorList.forEach(({ name, text }) => {
      errors[name] = { text }
    })
  }
  const value = result._original || {}
  return { value, errorSummary, errors }
}

module.exports = (view, viewData, messages = {}) => async function (request, h, errors) {
  // Merge the viewData with the formatted error messages
  Hoek.merge(viewData, await formatErrors(errors, messages), { mergeArrays: false })
  return h.view(view, viewData)
    .code(400)
    .takeover()
}

module.exports.formatErrors = formatErrors
