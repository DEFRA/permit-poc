const Application = require('../../dao/application')
const { logger } = require('defra-logging-facade')

module.exports = {
  method: 'GET',
  handler: async function (request, h) {
    logger.info(await Application.get(request))
    return h.view('form-layout.njk', {
      showTitle: true,
      pageTitle: 'Application complete'
    })
  }
}
