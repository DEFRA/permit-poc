const Application = require('../../dao/application')

class FacilityTypeHandlers extends require('../common/radio-group.handlers') {
  get Model () {
    return Application
  }

  get reference () {
    return require('../../reference/facility-types')
  }

  get propName () {
    return 'facilityType'
  }

  get selectError () {
    return 'Select the type of facility you want'
  }

  async isOnline (request) {
    const { facilityType } = await Application.get(request)
    const isOnline = this.reference.items.find(({ id, online }) => id === facilityType && online)
    return isOnline ? 'yes' : 'no'
  }
}

module.exports = FacilityTypeHandlers
