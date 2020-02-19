const hoek = require('@hapi/hoek')
const data = {}

const getNextPath = async function (request) {
  return '/'
}

module.exports = {
  method: ['GET', 'POST'],
  path: '/permit/category',
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
        // console.log(data)
      },
      getNextPath,
      pageDefinition: require('../views/permitCategory')
    }
  }
}
