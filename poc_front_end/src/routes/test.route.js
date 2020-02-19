const hoek = require('@hapi/hoek')
const data = {}

module.exports = {
  method: ['GET', 'POST'],
  path: '/test',
  handler: {
    'hapi-govuk-question-page': {
      pageTemplateName: 'page.template.njk',
      getConfig: async (request) => {
        return {
          $PAGE$: { title: 'Test harness page TEST', caption: new Date() },
          dynamicHtml: { parameterValues: [request.url, new Date()] },
          checkboxesField: { filter: ['Shetland', 'Shire'] },
          radiosField: { filter: ['soleTrader', 'privateLimitedCompany', 'limitedLiabilityPartnership', 'charity'] },
          numericRadiosField: { filter: [1, 3] },
          checkboxesWithTextField: { filter: ['email', 'phone', 'text'] },
          selectField: { filter: [910400184, 910400195, 910400196, 910400197, 910400198] }
        }
      },
      getData: async (request) => {
        return data
      },
      setData: async (request, dataToSet) => {
        hoek.merge(data, dataToSet, { mergeArrays: false })
        console.log(data)
      },
      getNextPath: async (request) => '/',
      pageDefinition: require('../views/test-harness-page')
    }
  }
}
