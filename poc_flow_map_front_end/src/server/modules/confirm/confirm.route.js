const Application = require('../../dao/application')
const view = 'confirm/confirm.view.njk'
const pageTitle = 'Confirm activities and costs'

async function reference (request) {
  const { permitType, permitCategory, standardRule } = await Application.get(request)
  return require(`../../reference/${permitType}/${permitCategory}/${standardRule}`)
}

function buildViewRow ({ id, label, cost, lastRow }) {
  const classes = lastRow ? 'govuk-!-font-weight-bold' : ''
  return [
    { text: label, classes, attributes: { id } },
    { text: cost, classes }
  ]
}

module.exports = [{
  method: 'GET',
  handler: async function (request, h) {
    const { 'cost-and-activities': costs } = await reference(request)

    const rows = costs.map((cost, index) => {
      const lastRow = index + 1 === costs.length
      return buildViewRow({ ...cost, lastRow })
    })

    return h.view(view, {
      showTitle: true,
      pageTitle,
      value: rows
    })
  }
}, {
  method: 'POST',
  handler: async function (request, h) {
    return h.continue
  }
}]
