class BespokeOrStandardRulesHandlers extends require('../common/radio-group.handlers') {
  get Model () {
    return require('../../dao/application')
  }

  get reference () {
    return require('../../reference/permit-types')
  }

  get propName () {
    return 'permitType'
  }

  get selectError () {
    return 'Select the type of permit you want'
  }
}

module.exports = BespokeOrStandardRulesHandlers
