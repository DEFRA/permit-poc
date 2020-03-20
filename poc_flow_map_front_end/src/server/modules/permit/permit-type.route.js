const Application = require('../../dao/application')
const { setQueryData } = require('hapi-govuk-journey-map')

module.exports = {
  method: ['GET', 'POST'],
  handler: {
    'hapi-govuk-question-page': {
      pageTemplateName: 'layout.njk',
      getData: async (request) => {
        return Application.get(request)
      },
      setData: async (request, data) => {
        setQueryData(request, data)
        return Application.update(request, data)
      },
      pageDefinition: require('./permit-type.view')
    }
  }
}
