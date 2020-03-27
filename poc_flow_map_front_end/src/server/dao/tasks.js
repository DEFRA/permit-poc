const Cache = require('../utils/cache')
const key = 'Tasks'

module.exports = class Tasks {
  static async get (request) {
    return await Cache.get(request, key) || {}
  }

  static async set (request, data) {
    return Cache.set(request, key, data)
  }

  static async update (request, val) {
    const tasks = await Tasks.get(request, key)
    return Tasks.set(request, { ...tasks, ...val })
  }
}
