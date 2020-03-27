const Application = require('../../dao/application')
const { sendToDynamics } = require('../../utils/transfer')
const { logger } = require('defra-logging-facade')

module.exports = [{
  method: 'GET',
  handler: async function (request, h) {
    // Display application details
    const application = await Application.get(request)
    logger.info(application)

    return h.view('form-layout.njk', {
      showTitle: true,
      pageTitle: 'Ready to send application'
    })
  }
}, {
  method: 'POST',
  handler: async function (request, h) {
    // Upload the application
    const application = await Application.get(request)
    await sendToDynamics(JSON.stringify(application), 'application')

    return h.continue
  }
}]
