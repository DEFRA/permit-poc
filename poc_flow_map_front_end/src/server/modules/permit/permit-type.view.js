const { BulletList, Link, Paragraph } = require('../../utils/tags')

const { load } = require('../../utils/reference')
const reference = load('permit-type')

const items = reference.map(({ id, label }) => {
  return {
    value: id,
    text: label
  }
})

const components = [
  {
    type: 'MojBanner',
    bannerType: 'information',
    content: '<h2 class="govuk-heading-m">This is an MOJ Frontend component</h2>'
  },
  {
    type: 'RadiosField',
    name: 'permitType',
    title: 'Select the type of permit you want to apply for',
    titleForError: 'the type of permit you want to apply for',
    options: {
      list: {
        type: 'string',
        items: items
      }
    }
  },
  {
    type: 'Details',
    title: 'Help with choosing the right type of permit',
    content: `
      ${Paragraph('If you\'re not sure which type of permit to choose, you can:')}
      ${BulletList([
          Link({
            link: 'https://www.gov.uk/guidance/check-if-you-need-an-environmental-permit',
            text: 'read about environmental permits on GOV.UK (opens new tab)'
          }),
          Link({
            link: 'https://www.gov.uk/government/organisations/environment-agency#org-contacts',
            text: 'contact the Environment Agency (opens new tab)'
          })
        ])
      }`
  }
]

module.exports = { components }
