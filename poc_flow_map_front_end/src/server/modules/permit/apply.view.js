const components = [
  {
    type: 'RadiosField',
    name: 'loginRequired',
    title: 'Apply for an environmental permit',
    titleForError: 'an option',
    options: {
      list: {
        type: 'string',
        items: [
          {
            value: 'no',
            text: 'Start a new application'
          },
          {
            value: 'yes',
            text: 'Log in'
          }
        ]
      }
    }
  }
]

module.exports = { components }
