const { getCurrent, setQueryData } = require('../../plugins/flow')

module.exports = [
  {
    method: 'GET',
    handler: function (request, h) {
      const { path, title = path } = getCurrent(request)
      return `
        <h1>${title}</h1>
        <form method="post">
            <h2>TEMPORARY COMMON FALLBACK PAGE</h2>
            <input type="submit" value="Submit">
        </form>`
    }
  }, {
    method: 'POST',
    handler: function (request, h) {
      setQueryData(request, { isOnline: 'yes' })
      return h.continue
    }
  }]
