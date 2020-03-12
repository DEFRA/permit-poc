const { Link, Paragraph } = require('../../utils/tags')

const { loadAll } = require('../../utils/reference')
const reference = loadAll('standard-rule')

const items = reference.map(({ id, label, hint }) => {
  return {
    value: id,
    text: label,
    description: hint
  }
})

const components = [
  {
    type: 'RadiosField',
    name: 'standardRule',
    options: {
      filterable: true,
      list: {
        type: 'string',
        items
      }
    }
  },
  {
    type: 'Details',
    title: 'I cannot find the permit I need',
    content: `
      ${Paragraph(`
        ${Link({
          link: 'https://www.gov.uk/topic/environmental-management/environmental-permits',
          text: 'Read more about waste environmental permits on GOV.UK (opens new tab)'
        })} or contact the Environment Agency.
      `)}
      ${Paragraph('We are open Monday to Friday, 8am to 6pm.')}
      ${Paragraph(`
        <span id="hint-email">Email ${Link({ link: 'mailto:enquiries@environment-agency.gov.uk', text: 'enquiries@environment-agency.gov.uk' })}</span><br>
        <span id="hint-telephone">Telephone 03708 506 506</span><br>
        <span id="hint-outside-uk-telephone">Telephone from outside the UK +44 (0) 114 282 5312</span><br>
        <span id="hint-minicom">Minicom (for the hard of hearing) 03702 422 549</span>
      `)}
    `
  }
]

module.exports = { components }
