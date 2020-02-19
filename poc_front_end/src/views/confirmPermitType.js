const title = 'Choose the type of permit you want'

const bespokeItem = { text: 'Bespoke', value: 'bespoke' }
const standardRulesItem = { text: 'Standard Rules', value: 'standardRules' }

const linkTargetRel = 'target="_blank" rel="noopener noreferrer"'

const readAboutPermits = {
  link: 'https://www.gov.uk/guidance/check-if-you-need-an-environmental-permit',
  text: 'read about environmental permits on GOV.UK (opens new tab)'
}

const contactEA = {
  link: 'https://www.gov.uk/government/organisations/environment-agency#org-contacts',
  text: 'contact the Environment Agency (opens new tab)'
}

const confirmPermitType = {
  type: 'RadiosField',
  name: 'permitType',
  title: ' ',
  titleForError: 'Select the type of permit you want',
  options: {
    list: {
      type: 'string',
      items: [standardRulesItem, bespokeItem]
    }
  }
}

const dontKnow = {
  type: 'Details',
  title: 'I don\'t know',
  content: `If you're not sure which type of permit to choose, you can:
  <ul>
    <li>
      <a href="${readAboutPermits.link}" ${linkTargetRel}>${readAboutPermits.text}</a>
    </li>
    <li>
      <a href="${contactEA.link}" ${linkTargetRel}>${contactEA.text}</a>
    </li>
  </ul>`
}

const components = [
  confirmPermitType,
  dontKnow
]

module.exports = { title, components }
