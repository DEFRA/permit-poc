const { BulletList, Link, Paragraph } = require('../../utils/tags')

const components = [
  {
    type: 'Details',
    name: 'applyOffline',
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
