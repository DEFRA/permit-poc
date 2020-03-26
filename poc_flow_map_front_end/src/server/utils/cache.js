const Hoek = require('@hapi/hoek')

class Cache {
  static get (request, key) {
    if (typeof key === 'string') {
      const data = request.yar.get(key)
      if (typeof data === 'object') {
        // Make sure this is a clone and not a pointer to the actual data
        return JSON.parse(JSON.stringify(data))
      }
      return data
    }
    // Retrieve each item specified in the array of keys
    // usage: const [a, b, c] = await utils.getCache(request, ['a', 'b', 'c'])
    return key.map((key) => {
      return Cache.get(request, key)
    })
  }

  static set (request, key, val) {
    return request.yar.set(key, val)
  }

  static update (request, key, val) {
    const data = Cache.get(request, key) || {}
    Hoek.merge(data, val)
    return Cache.set(request, key, { ...data })
  }

  static clear (request) {
    return request.yar.reset()
  }
}

module.exports = Cache
