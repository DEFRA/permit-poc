const Cache = require('../../utils/cache')

class HomeHandlers extends require('defra-hapi-handlers') {
  async handleGet (request, h, errors) {
    // Clear the cookies and create a new application
    await Cache.clear(request)

    await Cache.set(request, 'Application', {})

    const nextPath = await this.getNextPath(request)

    return h.redirect(nextPath)
  }
}

module.exports = HomeHandlers
