const helpDetails = require('../../partials/helpDetails')

const { load } = require('../../utils/reference')
const reference = load('permit-type')

const items = reference.map(({ id, label }) => {
  return {
    value: id,
    text: label
  }
})

const components = [
  {
    type: 'RadiosField',
    name: 'permitType',
    title: 'Select the type of permit you want to apply for',
    titleForError: 'the type of permit you want to apply for',
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
