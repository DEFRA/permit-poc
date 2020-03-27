const title = 'What are your contact details?'

const components = [
  {
    type: 'TextField',
    name: 'firstName',
    title: 'First name',
    titleForError: 'a first name'
  },
  {
    type: 'TextField',
    name: 'lastName',
    title: 'Last name',
    titleForError: 'a last name'
  },
  {
    type: 'TextField',
    name: 'emailAddress',
    title: 'Email address',
    titleForError: 'an email address'
  },
  {
    type: 'TelephoneNumberField',
    name: 'telephoneNumber',
    title: 'Telephone number',
    hint: 'It can be either a landline or a mobile number',
    titleForError: 'a telephone number'
  }
]

module.exports = { title, components }
