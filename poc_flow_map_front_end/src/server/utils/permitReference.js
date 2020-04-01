const Application = require('../dao/application')
const { Paragraph, Hint } = require('./tags')
const { load } = require('./reference')

async function getDetails (request) {
  const { standardRule, permitType, permitCategory } = await Application.get(request)
  const { ref, label, hint } = load(`${permitType}/${permitCategory}`).find(({ id }) => id === standardRule) || {}
  const { 'cost-and-activities': costAndActivities } = require(`../reference/${permitType}/${permitCategory}/${standardRule}`)
  const { cost } = costAndActivities[costAndActivities.length - 1]
  return [
    {
      term: 'Permit',
      definition: `
        ${Paragraph(`${label} (<b class="govuk-!-font-weight-bold">${ref}</b>)`)}
        ${hint ? Paragraph(`${Hint(hint)}`) : ''}
      `
    }, {
      term: 'Fee',
      definition: Paragraph(cost)
    }
  ]
}

module.exports = {
  getDetails
}
