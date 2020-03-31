const helpDetails = require('../../partials/helpDetails')

const { load } = require('../../utils/reference')
const reference = load('permit-category')

const items = reference.map(({ id, label }) => {
  return {
    value: id,
    text: label
  }
})

const components = [
  {
    type: 'RadiosField',
    name: 'permitCategory',
    title: 'What activity do you want the standard rules permit for?',
    titleForError: 'the activity you want the standard rules permit for',
    options: {
      list: {
        type: 'string',
        items: items
      }
    }
  },
  {
    type: 'Details',
    title: 'Help with choosing the right type of permit',
    content: helpDetails
  }
]

module.exports = { components }
