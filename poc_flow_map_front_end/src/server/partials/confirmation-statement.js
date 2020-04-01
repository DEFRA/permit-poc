const { Link, Paragraph, BulletList } = require('../utils/tags')

module.exports = `
  ${Paragraph('I confirm that:')}
  ${BulletList([
    `A written ${Link({ link: '#', text: 'management system' })} will be in place before we start operating`,
    'I am authorised to apply for this permit by the organisation or individual responsible',
    'The information I have given is true'
  ])}
  ${Paragraph(`
    ${Link({
      link: '/privacy',
      text: 'Privacy: how we use your personal information'
    })}
  `)}
`
