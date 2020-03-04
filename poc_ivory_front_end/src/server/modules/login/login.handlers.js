const { logger } = require('defra-logging-facade')

const idmUrl = process.env.IDM_HOST

class LoginHandlers extends require('defra-hapi-handlers') {
  async handlePost (request, h, errors) {
    const nextPath = await this.getNextPath(request)
    const redirectUrl = `${idmUrl}?redirect_path=${request.url.origin}${nextPath}`

    logger.info(`Redirecting to: ${redirectUrl}`)
    return h.redirect(redirectUrl)
  }
}

module.exports = LoginHandlers
