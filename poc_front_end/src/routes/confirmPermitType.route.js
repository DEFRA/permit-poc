const hoek = require('@hapi/hoek')
const data = {}

const getNextPath = async function (request) {
  switch (data.permitType) {
    case 'bespoke':
      return '/'
    case 'standardRules':
      return '/permit/category'
  }
}

module.exports = {
  method: ['GET', 'POST'],
  path: '/',
  handler: {
    'hapi-govuk-question-page': {
      pageTemplateName: 'page.template.njk',
      getConfig: async (request) => {
        return {
          // $PAGE$: heading,
          dynamicHtml: { parameterValues: [request.url, new Date()] }
        }
      },
      getData: async (request) => {
        return data
      },
      setData: async (request, dataToSet) => {
        hoek.merge(data, dataToSet, { mergeArrays: false })
        console.log(data)
      },
      getNextPath,
      pageDefinition: require('../views/confirmPermitType')
    }
  }
}
