const Cache = require('../utils/cache')
const key = 'Working'

module.exports = class Working {
  static async get (request) {
    return await Cache.get(request, key) || {}
  }

  static async set (request, data) {
    return Cache.set(request, key, data)
  }

  static async update (request, val) {
    const working = await Working.get(request, key)
    return Working.set(request, { ...working, ...val })
  }
}
