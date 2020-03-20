const Application = require('../../dao/application')
const { setQueryData } = require('hapi-govuk-journey-map')

const { load, loadAll } = require('../../utils/reference')

module.exports = {
  method: ['GET', 'POST'],
  handler: {
    'hapi-govuk-question-page': {
      pageTemplateName: 'layout.njk',
      getConfig: async (request) => {
        const { permitType, permitCategory } = await Application.get(request)
        const { label = '' } = load('permit-category').find(({ id }) => id === permitCategory) || {}
        return {
          standardRule: {
            title: `Select a ${label.toLowerCase()} permit`,
            filter: loadAll(permitType)
              .filter(({ type }) => type === permitCategory)
              .map(({ id }) => id)
          }
        }
      },
      getData: async (request) => {
        return Application.get(request)
      },
      setData: async (request, data) => {
        const reference = await loadAll('standard-rule')
        const { standardRule } = data
        const isOnline = reference.find(({ id, online }) => id === standardRule && online) ? 'yes' : 'no'
        setQueryData(request, { ...data, isOnline })
        return Application.update(request, data)
      },
      pageDefinition: require('./standard-rule-select.view')
    }
  }
}
