const Application = require('../../dao/application')

const { load, loadAll } = require('../../utils/reference')

const getDetails = async (request) => {
  const { permitCategory, standardRule } = await Application.get(request)
  if (standardRule) {
    return loadAll('standard-rule').find(({ id }) => id === standardRule) || {}
  }
  if (permitCategory) {
    return load('permit-category').find(({ id }) => id === permitCategory) || {}
  }
  return 'Unknown'
}

module.exports = {
  method: ['GET', 'POST'],
  handler: {
    'hapi-govuk-question-page': {
      pageTemplateName: 'layout.njk',
      getConfig: async (request) => {
        const { label = '', ref = '' } = await getDetails(request)
        return {
          $PAGE$: {
            title: `Select a ${label.toLowerCase()} permit${ref ? `(${ref})` : ''}`
          }
        }
      },
      getData: async (request) => {
        return Application.get(request)
      },
      pageDefinition: require('./apply-offline.view')
    }
  }
}
