const { Link, Paragraph } = require('../utils/tags')

module.exports = `
  ${Paragraph('There are various ways to get help:')}
  ${Paragraph(`
    ${Link({
      link: 'https://www.gov.uk/topic/environmental-management/environmental-permits',
      text: 'Standard rules environmental guidance'
    })}
  `)}
  ${Paragraph(`
    ${Link({
      link: 'https://www.gov.uk/topic/environmental-management/environmental-permits',
      text: 'Request pre-application advice from the Environment Agency'
    })}
  `)}
  ${Paragraph(`
      Contact the Environment Agency<br>
      (Open Monday to Friday, 8am to 6pm)<br>
      `
  )}
  ${Paragraph(`
    <span id="hint-email">Email: ${Link({
      link: 'mailto:enquiries@environment-agency.gov.uk',
      text: 'enquiries@environment-agency.gov.uk'
    })}</span><br>
    <span id="hint-telephone">Telephone 03708 506 506</span><br>
    <span id="hint-outside-uk-telephone">Telephone from outside the UK +44 (0) 114 282 5312</span><br>
    <span id="hint-minicom">Minicom (for the hard of hearing) 03702 422 549</span>
  `)}
`
