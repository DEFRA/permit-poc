const { logger } = require('defra-logging-facade')
const { getCurrent, getRoute } = require('../../plugins/flow')
const idmUrl = process.env.IDM_HOST

module.exports = [
  {
    method: 'GET',
    handler: function (request, h) {
      return h.view('login/login.view.njk', {
        showTitle: true,
        pageTitle: 'Press continue to login'
      })
    }
  }, {
    method: 'POST',
    handler: async function (request, h) {
      const nextRoute = getRoute(getCurrent(request).next)
      const redirectUrl = `${idmUrl}?redirect_path=${request.url.origin}${nextRoute.path}`

      logger.info(`Redirecting to: ${redirectUrl}`)
      return h.redirect(redirectUrl)
    }
  }
]
