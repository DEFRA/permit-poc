module.exports.BulletList = (items = [], options = {}) => {
  const { className = '' } = options
  return `<ul class="govuk-list govuk-list--bullet ${className}">${items.map((item) => `<li>${item}</li>`).join('')}</ul>`
}

module.exports.Link = ({ text, link, rel = 'noopener noreferrer', className = '' }) => {
  return `<a class="govuk-link ${className}" href="${link}" target="_blank" ${rel}>${text}</a>`
}

module.exports.Paragraph = (text, options = {}) => {
  const { className = '' } = options
  return `<p class="govuk-body ${className}">${text}</p>`
}
