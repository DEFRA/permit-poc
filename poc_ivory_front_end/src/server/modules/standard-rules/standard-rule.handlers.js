const Application = require('../../dao/application')

class CategoryHandlers extends require('../common/radio-group.handlers') {
  get Model () {
    return Application
  }

  get fieldname () {
    return 'standard-rule'
  }

  async reference (request) {
    const { permitType, permitCategory } = await Application.get(request)
    return require(`../../reference/${permitType}/${permitCategory}`)
  }

  get propName () {
    return 'standardRule'
  }

  get selectError () {
    return 'Select what you want the permit for'
  }

  buildViewItem ({ id, label, hint, value, ref }) {
    return {
      value: id,
      html: `<div class="permit-label"><span class="govuk-!-font-weight-bold govuk-radios-ref">${ref}</span><span class="govuk-radios-label">${label}</span></div>`,
      hint: hint && { text: hint },
      checked: value !== undefined && id === value
    }
  }

  async isOnline (request) {
    const { standardRule } = await Application.get(request)
    const { items } = await this.reference(request)
    const isOnline = items.find(({ id, online }) => id === standardRule && online)
    return isOnline ? 'yes' : 'no'
  }
}

module.exports = CategoryHandlers
