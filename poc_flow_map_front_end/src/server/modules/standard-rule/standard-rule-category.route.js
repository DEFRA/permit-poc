const Application = require('../../dao/application')
const { setQueryData } = require('hapi-govuk-journey-map')

const { load } = require('../../utils/reference')

module.exports = {
  method: ['GET', 'POST'],
  handler: {
    'hapi-govuk-question-page': {
      pageTemplateName: 'layout.njk',
      getData: async (request) => {
        return Application.get(request)
      },
      setData: async (request, data) => {
        const reference = load('permit-category')
        const { permitCategory } = data
        const isOnline = reference.find(({ id, online }) => id === permitCategory && online) ? 'yes' : 'no'
        setQueryData(request, { ...data, isOnline })
        return Application.update(request, data)
      },
      pageDefinition: require('./standard-rule-category.view')
    }
  }
}
