const Boom = require('@hapi/boom')
const Cache = require('../../utils/cache')
const Application = require('../../dao/application')

class LogInResultHandlers extends require('defra-hapi-handlers') {
  async handleGet (request, h, errors) {
    const { user_id: userId } = request.query

    if (!userId) {
      return Boom.unauthorized('Failed to login!')
    }

    // Clear the cookies and create a new application
    await Cache.clear(request)

    await Cache.set(request, 'UserId', { userId })
    await Application.set(request, {})

    const nextPath = await this.getNextPath(request)

    return h.redirect(nextPath)
  }
}

module.exports = LogInResultHandlers
