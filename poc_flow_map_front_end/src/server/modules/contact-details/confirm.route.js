const Application = require('../../dao/application')

module.exports = [
  {
    method: 'GET',
    handler: async function (request, h) {
      const { agentConsultant = '', firstName = '', lastName = '', emailAddress = '', telephoneNumber = '' } = await Application.get(request)

      const contactDetails = `${firstName} ${lastName}<br>${emailAddress}<br>${telephoneNumber}`

      return h.view('contact-details/confirm.view.njk', {
        showTitle: true,
        pageTitle: 'Confirm the contact details',
        agentConsultant: agentConsultant ? 'Yes' : 'No',
        contactDetails
      })
    }
  }, {
    method: 'POST',
    handler: async function (request, h) {
      return h.continue
    }
  }
]
