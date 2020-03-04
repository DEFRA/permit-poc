class ApplyForAPermitHandlers extends require('../common/radio-group.handlers') {
  get Model () {
    return require('../../dao/working')
  }

  get reference () {
    return {
      id: 'start-or-open',
      items: [
        {
          id: 'start',
          label: 'Start a new application'
        },
        {
          id: 'log-in',
          label: 'Log in'
        }
      ]
    }
  }

  get propName () {
    return 'startOrOpen'
  }

  get selectError () {
    return 'Select start new or open a saved application'
  }
}

module.exports = ApplyForAPermitHandlers
