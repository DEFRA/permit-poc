const { setQueryData, getQueryData } = require('../../plugins/flow')

module.exports = {
  method: ['GET', 'POST'],
  handler: {
    'hapi-govuk-question-page': {
      pageTemplateName: 'layout.njk',
      getData: async (request) => {
        return getQueryData(request) || {}
      },
      setData: async (request, data) => {
        return setQueryData(request, data)
      },
      pageDefinition: require('./apply.view')
    }
  }
}
