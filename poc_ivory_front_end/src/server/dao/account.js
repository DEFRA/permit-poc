const Cache = require('../utils/cache')
const key = 'Account'

module.exports = class Account {
  static async get (request) {
    return Cache.get(request, key)
  }

  static async set (request, data) {
    return Cache.set(request, key, data)
  }

  static async update (request, val) {
    const account = await Account.get(request, key)
    return Account.set(request, { ...account, ...val })
  }
}
