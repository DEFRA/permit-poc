const { logger } = require('defra-logging-facade')

const idmUrl = process.env.IDM_LOGIN_URL
const serviceUrl = process.env.SERVICE_URL

class LoginHandlers extends require('defra-hapi-handlers') {
  async handlePost (request, h, errors) {
    const nextPath = await this.getNextPath(request)
    const redirectUrl = `${idmUrl}?returnUrl=${serviceUrl}${nextPath}`

    logger.info(`Redirecting to: ${redirectUrl}`)
    return h.redirect(redirectUrl)
  }
}

module.exports = LoginHandlers
