const Cache = require('../utils/cache')

module.exports = {
  method: 'GET',
  handler: async function (request, h) {
    // Clear the cookies and create a new application
    await Cache.clear(request)

    await Cache.set(request, 'Application', {})
    return h.continue
  }
}
