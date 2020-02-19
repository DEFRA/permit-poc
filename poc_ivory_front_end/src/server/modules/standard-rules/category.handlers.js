const Application = require('../../dao/application')

class CategoryHandlers extends require('../common/radio-group.handlers') {
  get Model () {
    return Application
  }

  get reference () {
    return require('../../reference/permit-category')
  }

  get propName () {
    return 'permitCategory'
  }

  get selectError () {
    return 'Select what you want the permit for'
  }

  async isOnline (request) {
    const { permitCategory } = await Application.get(request)
    const isOnline = this.reference.items.find(({ id, online }) => id === permitCategory && online)
    return isOnline ? 'yes' : 'no'
  }
}

module.exports = CategoryHandlers
