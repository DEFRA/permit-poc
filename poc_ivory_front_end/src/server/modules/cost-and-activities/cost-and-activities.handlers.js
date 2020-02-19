const Application = require('../../dao/application')

class CostAndActivitiesHandlers extends require('defra-hapi-handlers') {
  async reference (request) {
    const { permitType, permitCategory, standardRule } = await Application.get(request)
    return require(`../../reference/${permitType}/${permitCategory}/${standardRule}`)
  }

  buildViewRow ({ id, label, cost, lastRow }) {
    const classes = lastRow ? 'govuk-!-font-weight-bold' : ''
    return [
      { text: label, classes, attributes: { id } },
      { text: cost, classes }
    ]
  }

  // Overrides parent class handleGet
  async handleGet (request, h, errors) {
    const { 'cost-and-activities': costs } = await this.reference(request)

    // Merge view data
    this.viewData = {
      rows: costs.map((cost, index) => {
        const lastRow = index + 1 === costs.length
        return this.buildViewRow({ ...cost, lastRow })
      })
    }

    return super.handleGet(request, h, errors)
  }
}

module.exports = CostAndActivitiesHandlers
