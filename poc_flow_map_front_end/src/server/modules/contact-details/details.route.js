const Application = require('../../dao/application')
const { setQueryData, getQueryData } = require('hapi-govuk-journey-map')

module.exports = {
  method: ['GET', 'POST'],
  handler: {
    'hapi-govuk-question-page': {
      pageTemplateName: 'layout.njk',
      getData: async (request) => {
        // Get existing query data to pre-populate the page
        return getQueryData(request) || {}
      },
      setData: async (request, data) => {
        // Save the query data
        setQueryData(request, data)

        // Update the application
        return Application.update(request, data)
      },
      pageDefinition: require('./details.view')
    }
  }
}
